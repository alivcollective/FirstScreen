/**
 * AUDIT-C Calculator (Alcohol Use Disorders Identification Test — Consumption)
 * Reference: Bush K et al. Arch Intern Med 1998;158:1789-1795
 * WHO AUDIT: Babor TF et al. 2001
 *
 * AUDIT-C = first 3 questions of full AUDIT
 * Max score = 12
 * Cutoff for hazardous drinking: ≥4 men, ≥3 women
 */

export interface AUDITCInput {
  /** Q1: How often do you have a drink containing alcohol? */
  frequencyKey: string
  /** Q2: How many drinks on a typical day? */
  amountKey: string
  /** Q3: How often ≥6 drinks on one occasion? */
  bingeKey: string
  sex: 'male' | 'female' | 'other'
}

export interface AUDITCResult {
  score: number
  /** Hazardous: ≥4 men, ≥3 women */
  hazardous: boolean
  risk: 'low' | 'hazardous' | 'harmful'
  descriptionTh: string
  /** Modifier for liver disease / cancer conditions */
  liverRiskModifier: number
}

// Score maps matching social_history_questions seed values
const Q1_MAP: Record<string, number> = {
  'ไม่เคยดื่ม': 0,
  'เดือนละครั้งหรือน้อยกว่า': 1,
  '2-4 ครั้ง/เดือน': 2,
  '2-3 ครั้ง/สัปดาห์': 3,
  '4+ ครั้ง/สัปดาห์': 4,
  // Aliases from seed
  '2–4 ครั้ง/เดือน': 2,
  '2–3 ครั้ง/สัปดาห์': 3,
  '4 ครั้งขึ้นไป/สัปดาห์': 4,
}

const Q2_MAP: Record<string, number> = {
  '1-2 แก้ว': 0,
  '3-4 แก้ว': 1,
  '5-6 แก้ว': 2,
  '7-9 แก้ว': 3,
  '10 แก้วขึ้นไป': 4,
  // Aliases
  '1–2 แก้ว': 0,
  '3–4 แก้ว': 1,
  '5–6 แก้ว': 2,
  '7–9 แก้ว': 3,
}

const Q3_MAP: Record<string, number> = {
  'ไม่เคย': 0,
  'น้อยกว่าเดือนละครั้ง': 1,
  'เดือนละครั้ง': 2,
  'สัปดาห์ละครั้ง': 3,
  'ทุกวันหรือเกือบทุกวัน': 4,
}

export function calculateAUDITC(input: AUDITCInput): AUDITCResult {
  const q1 = Q1_MAP[input.frequencyKey] ?? 0
  const q2 = Q2_MAP[input.amountKey] ?? 0
  const q3 = Q3_MAP[input.bingeKey] ?? 0
  const score = q1 + q2 + q3

  const cutoff = input.sex === 'female' ? 3 : 4
  const hazardous = score >= cutoff

  let risk: AUDITCResult['risk']
  let descriptionTh: string
  let liverRiskModifier: number

  if (score >= 8) {
    risk = 'harmful'
    descriptionTh = 'ระดับดื่มที่เป็นอันตราย — มีความเสี่ยงสูงต่อโรคตับและมะเร็ง'
    liverRiskModifier = 0.35
  } else if (hazardous) {
    risk = 'hazardous'
    descriptionTh = 'ระดับดื่มที่เสี่ยงต่อสุขภาพ — ควรปรึกษาแพทย์เรื่องการลดปริมาณ'
    liverRiskModifier = 0.20
  } else if (score >= 2) {
    risk = 'low'
    descriptionTh = 'ดื่มในระดับที่ยอมรับได้ แต่ควรระวังไม่ให้เพิ่มขึ้น'
    liverRiskModifier = 0.05
  } else {
    risk = 'low'
    descriptionTh = 'ดื่มในปริมาณน้อย ความเสี่ยงต่ำ'
    liverRiskModifier = 0
  }

  return { score, hazardous, risk, descriptionTh, liverRiskModifier }
}

/** Simplified AUDIT-C from numeric values (for programmatic use) */
export function calculateAUDITCFromScores(
  q1Score: number,
  q2Score: number,
  q3Score: number,
  sex: 'male' | 'female' | 'other'
): AUDITCResult {
  const score = q1Score + q2Score + q3Score
  return calculateAUDITC({
    frequencyKey: Object.keys(Q1_MAP).find(k => Q1_MAP[k] === q1Score) ?? '',
    amountKey: Object.keys(Q2_MAP).find(k => Q2_MAP[k] === q2Score) ?? '',
    bingeKey: Object.keys(Q3_MAP).find(k => Q3_MAP[k] === q3Score) ?? '',
    sex,
  })
}
