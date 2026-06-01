/**
 * FINDRISC — Finnish Diabetes Risk Score (Asian-adjusted)
 * Reference: Lindström J, Tuomilehto J. Diabetes Care 2003;26(3):725-731
 * Asian BMI adjustments: WHO Expert Consultation, Lancet 2004
 * Thai Waist cutoffs: กรมการแพทย์ / IDF
 *
 * SAFETY: Educational use only. PENDING physician validation.
 */

export interface FINDRISCInput {
  age: number
  bmi: number
  waistCm: number
  sex: 'male' | 'female' | 'other'
  exerciseMeets150MinPerWeek: boolean  // false=2pts, true=0
  eatsVegetablesDaily: boolean         // false=1pt, true=0
  hasHypertension: boolean             // true=2pts
  hasHighGlucoseHistory: boolean       // ever told high glucose: true=5pts
  familyDiabetes: 'none' | 'second_degree' | 'first_degree'
}

export interface FINDRISCResult {
  score: number
  riskLevel: 'low' | 'slightly_elevated' | 'moderate' | 'high' | 'very_high'
  tenYearRiskPercent: number
  descriptionTh: string
  actionTh: string
  breakdown: Record<string, number>
}

function getAgePoints(age: number): number {
  if (age < 45) return 0
  if (age < 55) return 2
  if (age < 65) return 3
  return 4
}

/** Asian-adjusted BMI thresholds (WHO 2004) */
function getBMIPoints(bmi: number): number {
  if (bmi < 23) return 0       // Normal (Asian)
  if (bmi < 27.5) return 1     // Overweight (Asian: 23–27.4)
  return 3                      // Obese (Asian: ≥27.5)
}

/** Thai waist cutoffs: men ≥90cm, women ≥80cm */
function getWaistPoints(waistCm: number, sex: 'male' | 'female' | 'other'): number {
  const cutoff = sex === 'female' ? 80 : 90
  return waistCm >= cutoff ? 3 : 0
}

function getFamilyDiabetesPoints(family: FINDRISCInput['familyDiabetes']): number {
  if (family === 'first_degree') return 5
  if (family === 'second_degree') return 3
  return 0
}

export function calculateFINDRISC(input: FINDRISCInput): FINDRISCResult {
  const breakdown: Record<string, number> = {}

  breakdown.age = getAgePoints(input.age)
  breakdown.bmi = getBMIPoints(input.bmi)
  breakdown.waist = getWaistPoints(input.waistCm, input.sex)
  breakdown.exercise = input.exerciseMeets150MinPerWeek ? 0 : 2
  breakdown.vegetables = input.eatsVegetablesDaily ? 0 : 1
  breakdown.hypertension = input.hasHypertension ? 2 : 0
  breakdown.glucose_history = input.hasHighGlucoseHistory ? 5 : 0
  breakdown.family = getFamilyDiabetesPoints(input.familyDiabetes)

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0)

  let riskLevel: FINDRISCResult['riskLevel']
  let tenYearRiskPercent: number
  let descriptionTh: string
  let actionTh: string

  if (score < 7) {
    riskLevel = 'low'
    tenYearRiskPercent = 1
    descriptionTh = 'ความเสี่ยงต่ำ (ประมาณ 1 ใน 100 คนจะเป็นเบาหวานใน 10 ปี)'
    actionTh = 'รักษาวิถีชีวิตที่ดี ออกกำลังกายสม่ำเสมอ ตรวจน้ำตาลทุก 3 ปี'
  } else if (score < 12) {
    riskLevel = 'slightly_elevated'
    tenYearRiskPercent = 4
    descriptionTh = 'ความเสี่ยงสูงขึ้นเล็กน้อย (ประมาณ 4 ใน 100 คน)'
    actionTh = 'ปรับวิถีชีวิต ลดน้ำหนัก ตรวจน้ำตาลทุก 1–2 ปี'
  } else if (score < 15) {
    riskLevel = 'moderate'
    tenYearRiskPercent = 17
    descriptionTh = 'ความเสี่ยงปานกลาง (ประมาณ 17 ใน 100 คน)'
    actionTh = 'พบแพทย์เพื่อตรวจน้ำตาลขณะอดอาหาร (FPG) หรือ OGTT โดยเร็ว'
  } else if (score <= 20) {
    riskLevel = 'high'
    tenYearRiskPercent = 33
    descriptionTh = 'ความเสี่ยงสูง (ประมาณ 33 ใน 100 คน)'
    actionTh = 'ควรตรวจวินิจฉัยและเริ่มโปรแกรมป้องกันเบาหวานทันที'
  } else {
    riskLevel = 'very_high'
    tenYearRiskPercent = 50
    descriptionTh = 'ความเสี่ยงสูงมาก (ประมาณ 50 ใน 100 คน) — อาจมีเบาหวานแล้ว'
    actionTh = 'ต้องตรวจวินิจฉัยโดยแพทย์ทันที อาจมีภาวะก่อนเบาหวานหรือเบาหวานแล้ว'
  }

  return { score, riskLevel, tenYearRiskPercent, descriptionTh, actionTh, breakdown }
}
