/**
 * Pack-Year Calculator
 * Formula: (cigarettes/day ÷ 20) × years smoked
 * Reference: U.S. Surgeon General reports; NLST criteria (NEJM 2011)
 */

export function calculatePackYears(
  cigarettesPerDay: number,
  yearsSmoked: number
): number {
  if (cigarettesPerDay <= 0 || yearsSmoked <= 0) return 0
  return Math.round(((cigarettesPerDay / 20) * yearsSmoked) * 10) / 10
}

export interface SmokingRisk {
  packYears: number
  level: 'none' | 'low' | 'moderate' | 'high' | 'very_high'
  /** NLST criteria: ≥20 pack-years + age 50–80 (age checked separately) */
  nlstEligible: boolean
  descriptionTh: string
  /** Modifier applied to CVD/cancer base scores (0.0–0.5) */
  riskModifier: number
}

export function getSmokingRisk(
  packYears: number,
  quitYearsAgo?: number | null
): SmokingRisk {
  const longTermQuitter = typeof quitYearsAgo === 'number' && quitYearsAgo > 15

  if (packYears <= 0) {
    return {
      packYears: 0,
      level: 'none',
      nlstEligible: false,
      descriptionTh: 'ไม่สูบบุหรี่',
      riskModifier: 0,
    }
  }

  if (longTermQuitter) {
    return {
      packYears,
      level: packYears >= 20 ? 'moderate' : 'low',
      nlstEligible: packYears >= 20,
      descriptionTh: 'เลิกสูบนาน > 15 ปี — ความเสี่ยงลดลงมากแล้ว แต่ยังสูงกว่าคนไม่สูบ',
      riskModifier: 0.05,
    }
  }

  const recentQuitter = typeof quitYearsAgo === 'number' && quitYearsAgo <= 5

  if (packYears < 10) {
    return {
      packYears,
      level: 'low',
      nlstEligible: false,
      descriptionTh: 'ความเสี่ยงต่ำ แต่การเลิกสูบจะลดความเสี่ยงได้มากที่สุด',
      riskModifier: 0.10,
    }
  }
  if (packYears < 20) {
    return {
      packYears,
      level: 'moderate',
      nlstEligible: false,
      descriptionTh: recentQuitter
        ? 'เพิ่งเลิกสูบ ความเสี่ยงยังสูงอยู่ในช่วง 5 ปีแรก'
        : 'ความเสี่ยงปานกลาง แนะนำเลิกสูบเพื่อลดความเสี่ยง',
      riskModifier: 0.20,
    }
  }
  if (packYears < 40) {
    return {
      packYears,
      level: 'high',
      nlstEligible: true,
      descriptionTh: 'ความเสี่ยงสูง — เข้าเกณฑ์ตรวจคัดกรองมะเร็งปอด (Low-dose CT scan)',
      riskModifier: 0.35,
    }
  }
  return {
    packYears,
    level: 'very_high',
    nlstEligible: true,
    descriptionTh: 'ความเสี่ยงสูงมาก ควรพบแพทย์เพื่อตรวจคัดกรองโดยเร็ว',
    riskModifier: 0.50,
  }
}

/** Apply smoking modifier to a base score (used by differential engine) */
export function applySmokingModifier(
  baseScore: number,
  packYears: number,
  quitYearsAgo?: number | null,
  conditionModifier: number = 0
): number {
  if (packYears <= 0 || conditionModifier === 0) return baseScore

  const { riskModifier } = getSmokingRisk(packYears, quitYearsAgo)

  // Heavy smokers (≥20 pack-years) get additional 20% boost on relevant conditions
  const heavyBoost = packYears >= 20 ? 1.2 : 1.0

  return baseScore + conditionModifier * riskModifier * heavyBoost
}
