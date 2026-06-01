/**
 * Framingham 10-Year CVD Risk Score — Full ATP III Implementation
 * Reference: Wilson PWF et al. Circulation 1998;97:1837-1847
 *            Expert Panel ATP III, JAMA 2001
 *
 * SAFETY: Educational use only. Results PENDING physician validation.
 */

export interface FraminghamInput {
  age: number              // 20–79
  sex: 'male' | 'female'
  totalCholesterol: number // mg/dL
  hdlCholesterol: number   // mg/dL
  systolicBP: number       // mmHg
  bpTreatment: boolean     // currently on BP medication?
  smokingStatus: 'never' | 'current' | 'former'
  diabetes: boolean
}

export interface FraminghamResult {
  points: number
  tenYearRiskPercent: number
  riskCategory: 'low' | 'intermediate' | 'high' | 'very_high'
  descriptionTh: string
  recommendationsTh: string[]
}

// ── Age points ──────────────────────────────────────────────

function getAgePoints(age: number, sex: 'male' | 'female'): number {
  if (sex === 'male') {
    if (age < 35) return -9
    if (age < 40) return -4
    if (age < 45) return 0
    if (age < 50) return 3
    if (age < 55) return 6
    if (age < 60) return 8
    if (age < 65) return 10
    if (age < 70) return 11
    if (age < 75) return 12
    return 13
  } else {
    if (age < 35) return -7
    if (age < 40) return -3
    if (age < 45) return 0
    if (age < 50) return 3
    if (age < 55) return 6
    if (age < 60) return 8
    if (age < 65) return 10
    if (age < 70) return 12
    if (age < 75) return 14
    return 16
  }
}

// ── Cholesterol points (age-stratified) ─────────────────────

type AgeGroup = '20-39' | '40-49' | '50-59' | '60-69' | '70-79'

function getAgeGroup(age: number): AgeGroup {
  if (age < 40) return '20-39'
  if (age < 50) return '40-49'
  if (age < 60) return '50-59'
  if (age < 70) return '60-69'
  return '70-79'
}

const CHOL_POINTS_MALE: Record<AgeGroup, [number, number, number, number, number]> = {
  // [<160, 160-199, 200-239, 240-279, ≥280]
  '20-39': [0, 4, 7, 9, 11],
  '40-49': [0, 3, 5, 6, 8],
  '50-59': [0, 2, 3, 4, 5],
  '60-69': [0, 1, 1, 2, 3],
  '70-79': [0, 0, 0, 1, 1],
}

const CHOL_POINTS_FEMALE: Record<AgeGroup, [number, number, number, number, number]> = {
  '20-39': [0, 4, 8, 11, 13],
  '40-49': [0, 3, 6, 8, 10],
  '50-59': [0, 2, 4, 5, 7],
  '60-69': [0, 1, 2, 3, 4],
  '70-79': [0, 1, 1, 2, 2],
}

function getCholPoints(totalChol: number, age: number, sex: 'male' | 'female'): number {
  const ag = getAgeGroup(age)
  const table = sex === 'male' ? CHOL_POINTS_MALE[ag] : CHOL_POINTS_FEMALE[ag]
  if (totalChol < 160) return table[0]
  if (totalChol < 200) return table[1]
  if (totalChol < 240) return table[2]
  if (totalChol < 280) return table[3]
  return table[4]
}

// ── HDL points ───────────────────────────────────────────────

function getHDLPoints(hdl: number): number {
  if (hdl >= 60) return -1
  if (hdl >= 50) return 0
  if (hdl >= 40) return 1
  return 2
}

// ── Smoking points (age-stratified) ─────────────────────────

const SMOKING_POINTS_MALE: Record<AgeGroup, number> = {
  '20-39': 8, '40-49': 5, '50-59': 3, '60-69': 1, '70-79': 1,
}
const SMOKING_POINTS_FEMALE: Record<AgeGroup, number> = {
  '20-39': 9, '40-49': 7, '50-59': 4, '60-69': 2, '70-79': 1,
}

function getSmokingPoints(
  status: 'never' | 'current' | 'former',
  age: number,
  sex: 'male' | 'female'
): number {
  if (status !== 'current') return 0
  const ag = getAgeGroup(age)
  return sex === 'male' ? SMOKING_POINTS_MALE[ag] : SMOKING_POINTS_FEMALE[ag]
}

// ── Systolic BP points ───────────────────────────────────────

function getSystolicBPPoints(
  sbp: number,
  treated: boolean,
  sex: 'male' | 'female'
): number {
  if (sex === 'male') {
    if (!treated) {
      if (sbp < 120) return 0
      if (sbp < 130) return 0
      if (sbp < 140) return 1
      if (sbp < 160) return 1
      return 2
    } else {
      if (sbp < 120) return 0
      if (sbp < 130) return 1
      if (sbp < 140) return 2
      if (sbp < 160) return 2
      return 3
    }
  } else {
    if (!treated) {
      if (sbp < 120) return -3
      if (sbp < 130) return 0
      if (sbp < 140) return 1
      if (sbp < 150) return 2
      if (sbp < 160) return 4
      return 5
    } else {
      if (sbp < 120) return -1
      if (sbp < 130) return 2
      if (sbp < 140) return 3
      if (sbp < 150) return 5
      if (sbp < 160) return 6
      return 7
    }
  }
}

// ── Points → Risk % ──────────────────────────────────────────

const MALE_RISK_MAP: Record<number, number> = {
  [-10]: 1, [-9]: 1, [-8]: 1, [-7]: 1, [-6]: 1,
  [-5]: 1, [-4]: 1, [-3]: 1, [-2]: 1, [-1]: 1,
  0: 1, 1: 1, 2: 1, 3: 1, 4: 1,
  5: 2, 6: 2, 7: 3, 8: 4, 9: 5,
  10: 6, 11: 8, 12: 10, 13: 12, 14: 16,
  15: 20, 16: 25,
}

const FEMALE_RISK_MAP: Record<number, number> = {
  [-10]: 1, [-9]: 1, [-8]: 1, [-7]: 1, [-6]: 1,
  [-5]: 1, [-4]: 1, [-3]: 1, [-2]: 1, [-1]: 1,
  0: 1, 1: 1, 2: 1, 3: 1, 4: 1,
  5: 1, 6: 1, 7: 1, 8: 1,
  9: 1, 10: 1, 11: 1, 12: 1,
  13: 2, 14: 2, 15: 3, 16: 4,
  17: 5, 18: 6, 19: 8, 20: 11,
  21: 14, 22: 17, 23: 22, 24: 27,
}

function pointsToRisk(points: number, sex: 'male' | 'female'): number {
  if (sex === 'male') {
    if (points >= 17) return 30
    return MALE_RISK_MAP[Math.max(-10, points)] ?? 1
  } else {
    if (points >= 25) return 30
    return FEMALE_RISK_MAP[Math.max(-10, points)] ?? 1
  }
}

// ── Main function ────────────────────────────────────────────

export function calculateFramingham(input: FraminghamInput): FraminghamResult {
  const { age, sex, totalCholesterol, hdlCholesterol, systolicBP, bpTreatment, smokingStatus, diabetes } = input

  const agePoints = getAgePoints(age, sex)
  const cholPoints = getCholPoints(totalCholesterol, age, sex)
  const hdlPoints = getHDLPoints(hdlCholesterol)
  const smokingPoints = getSmokingPoints(smokingStatus, age, sex)
  const bpPoints = getSystolicBPPoints(systolicBP, bpTreatment, sex)
  const diabetesPoints = diabetes ? (sex === 'male' ? 3 : 4) : 0

  const totalPoints = agePoints + cholPoints + hdlPoints + smokingPoints + bpPoints + diabetesPoints
  const riskPct = pointsToRisk(totalPoints, sex)

  let riskCategory: FraminghamResult['riskCategory']
  let descriptionTh: string

  if (riskPct < 5) {
    riskCategory = 'low'
    descriptionTh = 'ความเสี่ยงต่ำ (< 5%) — ดูแลสุขภาพเชิงป้องกันตามปกติ'
  } else if (riskPct < 10) {
    riskCategory = 'intermediate'
    descriptionTh = 'ความเสี่ยงปานกลาง (5–9%) — แนะนำปรับวิถีชีวิต'
  } else if (riskPct < 20) {
    riskCategory = 'high'
    descriptionTh = 'ความเสี่ยงสูง (10–19%) — ควรปรึกษาแพทย์เพื่อพิจารณาเริ่มยา'
  } else {
    riskCategory = 'very_high'
    descriptionTh = 'ความเสี่ยงสูงมาก (≥20%) — ควรพบแพทย์เพื่อวางแผนรักษาโดยเร็ว'
  }

  const recs: string[] = []
  if (smokingStatus === 'current') recs.push('เลิกสูบบุหรี่ทันที — ลดความเสี่ยงได้ถึง 50% ใน 1 ปี')
  if (systolicBP >= 130) recs.push('ควบคุมความดันโลหิต < 130/80 mmHg')
  if (totalCholesterol >= 200) recs.push('ตรวจและควบคุม LDL cholesterol')
  if (hdlCholesterol < 40) recs.push('เพิ่ม HDL ด้วยการออกกำลังกายสม่ำเสมอ')
  if (diabetes) recs.push('ควบคุมระดับน้ำตาล HbA1c < 7%')
  recs.push('ออกกำลังกายแบบ aerobic ≥ 150 นาที/สัปดาห์')

  return { points: totalPoints, tenYearRiskPercent: riskPct, riskCategory, descriptionTh, recommendationsTh: recs }
}
