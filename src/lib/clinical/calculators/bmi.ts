/**
 * BMI Calculator with Asian-specific cutoffs
 * Reference: WHO Expert Consultation, Lancet 2004; IOTF Asia-Pacific
 * Thai Waist Circumference cutoffs: Men >90cm, Women >80cm
 * Source: กรมการแพทย์ สธ. / International Diabetes Federation
 */

export interface BMIResult {
  bmi: number
  /** WHO standard categories */
  categoryWHO: 'underweight' | 'normal' | 'overweight' | 'obese_1' | 'obese_2' | 'obese_3'
  /** Asian/Thai-adjusted categories (lower thresholds) */
  categoryAsian: 'underweight' | 'normal' | 'at_risk' | 'obese_1' | 'obese_2'
  labelTh: string
  /** Risk modifier for metabolic conditions */
  metabolicRiskModifier: number
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10

  // WHO standard
  let categoryWHO: BMIResult['categoryWHO']
  if (bmi < 18.5) categoryWHO = 'underweight'
  else if (bmi < 25) categoryWHO = 'normal'
  else if (bmi < 30) categoryWHO = 'overweight'
  else if (bmi < 35) categoryWHO = 'obese_1'
  else if (bmi < 40) categoryWHO = 'obese_2'
  else categoryWHO = 'obese_3'

  // Asian-adjusted (WHO 2004)
  let categoryAsian: BMIResult['categoryAsian']
  let labelTh: string
  let metabolicRiskModifier: number

  if (bmi < 18.5) {
    categoryAsian = 'underweight'
    labelTh = 'น้ำหนักน้อยกว่าเกณฑ์'
    metabolicRiskModifier = 0
  } else if (bmi < 23) {
    categoryAsian = 'normal'
    labelTh = 'น้ำหนักปกติ (Asian normal)'
    metabolicRiskModifier = 0
  } else if (bmi < 27.5) {
    categoryAsian = 'at_risk'
    labelTh = 'น้ำหนักเกิน — เสี่ยงต่อโรคเมตาบอลิก'
    metabolicRiskModifier = 0.10
  } else if (bmi < 32.5) {
    categoryAsian = 'obese_1'
    labelTh = 'อ้วนระดับ 1 — ความเสี่ยงสูง'
    metabolicRiskModifier = 0.25
  } else {
    categoryAsian = 'obese_2'
    labelTh = 'อ้วนระดับ 2 — ความเสี่ยงสูงมาก'
    metabolicRiskModifier = 0.40
  }

  return { bmi, categoryWHO, categoryAsian, labelTh, metabolicRiskModifier }
}

export interface WaistRiskResult {
  isAtRisk: boolean
  labelTh: string
  riskModifier: number
}

/** Thai waist circumference risk (IDF/Thai MoPH criteria) */
export function assessWaistRisk(
  waistCm: number,
  sex: 'male' | 'female' | 'other'
): WaistRiskResult {
  const cutoff = sex === 'female' ? 80 : 90 // Thai cutoffs: M>90, F>80
  const isAtRisk = waistCm >= cutoff

  return {
    isAtRisk,
    labelTh: isAtRisk
      ? `รอบเอวเกินเกณฑ์ (${sex === 'female' ? '≥80' : '≥90'} ซม.) — เสี่ยงโรคเมตาบอลิก`
      : 'รอบเอวอยู่ในเกณฑ์ปกติ',
    riskModifier: isAtRisk ? 0.15 : 0,
  }
}

/** Combined metabolic risk (BMI + waist) */
export function getMetabolicRisk(
  bmi: number,
  waistCm: number,
  sex: 'male' | 'female' | 'other'
): { level: 'low' | 'moderate' | 'high'; modifier: number; labelTh: string } {
  const bmiResult = calculateBMI(bmi * 100, 100) // hack: pass bmi directly
  // Re-derive from raw bmi
  const bmiMod = bmi >= 27.5 ? 0.25 : bmi >= 23 ? 0.10 : 0

  const waistResult = assessWaistRisk(waistCm, sex)
  const combined = bmiMod + waistResult.riskModifier

  if (combined >= 0.35) return { level: 'high', modifier: combined, labelTh: 'ความเสี่ยงเมตาบอลิกสูง' }
  if (combined >= 0.15) return { level: 'moderate', modifier: combined, labelTh: 'ความเสี่ยงเมตาบอลิกปานกลาง' }
  return { level: 'low', modifier: combined, labelTh: 'ความเสี่ยงเมตาบอลิกต่ำ' }
}
