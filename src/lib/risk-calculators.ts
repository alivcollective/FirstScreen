import type { HealthProfile, RiskAssessmentResult, ActionItem } from '@/types'

// FINDRISC — Finnish Diabetes Risk Score (adapted for Asian populations)
export function calculateDiabetesRisk(profile: HealthProfile): RiskAssessmentResult {
  const age = new Date().getFullYear() - profile.birthYear
  let score = 0

  // Age scoring
  if (age >= 45 && age <= 54) score += 2
  else if (age >= 55 && age <= 64) score += 3
  else if (age >= 65) score += 4

  // BMI scoring (Asian-adjusted thresholds)
  const bmi = profile.weightKg / Math.pow(profile.heightCm / 100, 2)
  if (bmi >= 23 && bmi < 27.5) score += 1
  else if (bmi >= 27.5 && bmi < 32.5) score += 3
  else if (bmi >= 32.5) score += 5

  // Physical activity
  if (profile.exerciseDaysPerWeek < 3) score += 2

  // Family history
  const hasDiabetesFH = profile.familyHistory.some(
    fh => fh.conditionName.toLowerCase().includes('diabetes')
  )
  if (hasDiabetesFH) score += 5

  let riskCategory: RiskAssessmentResult['riskCategory']
  let riskLabel: string
  let riskPercentage: number
  let interpretation: string

  if (score < 7) {
    riskCategory = 'low'
    riskLabel = 'Low Risk'
    riskPercentage = 1
    interpretation = 'Your current risk for developing Type 2 Diabetes is low. Maintaining your current healthy habits is the best protection.'
  } else if (score < 12) {
    riskCategory = 'moderate'
    riskLabel = 'Slightly Elevated Risk'
    riskPercentage = 4
    interpretation = 'Your risk for Type 2 Diabetes is slightly elevated. Lifestyle improvements can significantly reduce this risk.'
  } else if (score < 15) {
    riskCategory = 'high'
    riskLabel = 'Moderate Risk'
    riskPercentage = 17
    interpretation = 'You have a moderate risk of developing Type 2 Diabetes. A fasting blood glucose test is recommended.'
  } else if (score < 21) {
    riskCategory = 'high'
    riskLabel = 'High Risk'
    riskPercentage = 33
    interpretation = 'Your risk for Type 2 Diabetes is high. Please consult a healthcare provider for a diabetes screening test.'
  } else {
    riskCategory = 'very_high'
    riskLabel = 'Very High Risk'
    riskPercentage = 50
    interpretation = 'You have a very high risk. There is a strong chance you may already have undiagnosed Type 2 Diabetes or pre-diabetes. Please seek medical evaluation promptly.'
  }

  const actionPlan: ActionItem[] = [
    ...(riskCategory !== 'low' ? [{
      priority: 'immediate' as const,
      category: 'screening' as const,
      title: 'Schedule a Fasting Blood Glucose Test',
      description: 'A simple blood test can detect pre-diabetes or diabetes. Available at most hospitals and clinics.',
    }] : []),
    {
      priority: 'ongoing' as const,
      category: 'lifestyle' as const,
      title: 'Increase Physical Activity',
      description: 'Aim for 150 minutes of moderate exercise per week. Even 30-minute daily walks significantly reduce diabetes risk.',
    },
    {
      priority: 'ongoing' as const,
      category: 'lifestyle' as const,
      title: 'Reduce Sugar and Refined Carbohydrates',
      description: 'Replace white rice with brown rice or vegetables. Limit sugary drinks, including fruit juices.',
    },
    ...(bmi >= 23 ? [{
      priority: 'soon' as const,
      category: 'medical' as const,
      title: 'Discuss Weight Management with Your Doctor',
      description: 'Even a 5-7% weight reduction can cut diabetes risk by up to 58%.',
    }] : []),
  ]

  return {
    calculatorId: 'findrisc-asian-adapted',
    calculatorName: 'Diabetes Risk Score (FINDRISC — Asian Adapted)',
    category: 'diabetes',
    riskCategory,
    riskPercentage,
    riskLabel,
    score,
    interpretation,
    actionPlan,
    createdAt: new Date().toISOString(),
  }
}

// Framingham 10-Year Cardiovascular Risk (simplified)
export function calculateCardiovascularRisk(
  profile: HealthProfile,
  extras: {
    systolicBP: number
    totalCholesterol: number
    hdlCholesterol: number
    onBPMeds: boolean
    hasDiabetes: boolean
  }
): RiskAssessmentResult {
  const age = new Date().getFullYear() - profile.birthYear
  let points = 0
  const isMale = profile.biologicalSex === 'male'

  // Age points (simplified Framingham)
  if (isMale) {
    if (age < 35) points += 0
    else if (age <= 39) points += 2
    else if (age <= 44) points += 5
    else if (age <= 49) points += 6
    else if (age <= 54) points += 8
    else if (age <= 59) points += 10
    else if (age <= 64) points += 11
    else if (age <= 69) points += 12
    else points += 13
  } else {
    if (age < 35) points += 0
    else if (age <= 39) points += 2
    else if (age <= 44) points += 4
    else if (age <= 49) points += 5
    else if (age <= 54) points += 7
    else if (age <= 59) points += 8
    else if (age <= 64) points += 9
    else if (age <= 69) points += 10
    else points += 11
  }

  // Smoking
  if (profile.isSmoker) points += isMale ? 4 : 3

  // Diabetes
  if (extras.hasDiabetes) points += isMale ? 3 : 4

  // Blood pressure
  if (extras.systolicBP >= 160) points += 3
  else if (extras.systolicBP >= 140) points += 2
  else if (extras.systolicBP >= 130) points += 1

  // Cholesterol ratio
  const cholRatio = extras.totalCholesterol / extras.hdlCholesterol
  if (cholRatio >= 7) points += 4
  else if (cholRatio >= 6) points += 3
  else if (cholRatio >= 5) points += 2
  else if (cholRatio >= 4) points += 1

  // Convert points to 10-year risk %
  const riskTable: Record<number, number> = {
    0: 1, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3, 7: 4, 8: 5, 9: 6,
    10: 8, 11: 10, 12: 12, 13: 16, 14: 20, 15: 25, 16: 30,
  }
  const riskPercentage = riskTable[Math.min(points, 16)] || 30

  let riskCategory: RiskAssessmentResult['riskCategory']
  if (riskPercentage < 10) riskCategory = 'low'
  else if (riskPercentage < 20) riskCategory = 'moderate'
  else if (riskPercentage < 30) riskCategory = 'high'
  else riskCategory = 'very_high'

  const actionPlan: ActionItem[] = [
    ...(profile.isSmoker ? [{
      priority: 'immediate' as const,
      category: 'lifestyle' as const,
      title: 'Quit Smoking',
      description: 'Smoking cessation is the single most impactful action you can take. Within 1 year, your excess heart attack risk falls by 50%.',
    }] : []),
    {
      priority: 'soon' as const,
      category: 'screening' as const,
      title: 'Get a Full Cardiovascular Panel',
      description: 'Lipid panel, blood pressure check, ECG baseline. Available at most hospitals.',
    },
    {
      priority: 'ongoing' as const,
      category: 'lifestyle' as const,
      title: 'Heart-Healthy Diet',
      description: 'Reduce saturated fat, increase vegetables, whole grains, and fish. Mediterranean-style diet reduces CVD risk by 30%.',
    },
    {
      priority: 'ongoing' as const,
      category: 'monitoring' as const,
      title: 'Monitor Blood Pressure Regularly',
      description: 'Target below 130/80 mmHg. Home monitoring twice daily for one week every 3 months.',
    },
  ]

  const riskLabel = riskPercentage < 10
    ? 'Low Risk (<10%)'
    : riskPercentage < 20
    ? 'Moderate Risk (10-20%)'
    : riskPercentage < 30
    ? 'High Risk (20-30%)'
    : 'Very High Risk (>30%)'

  return {
    calculatorId: 'framingham-cvd-10year',
    calculatorName: 'Framingham 10-Year Cardiovascular Risk Score',
    category: 'cardiovascular',
    riskCategory,
    riskPercentage,
    riskLabel,
    score: points,
    interpretation: `Your 10-year risk of a major cardiovascular event (heart attack or stroke) is estimated at ${riskPercentage}%. This is based on the Framingham Heart Study risk calculator.`,
    actionPlan,
    createdAt: new Date().toISOString(),
  }
}

// BMI Calculator with Asian-adjusted thresholds
export function calculateBMI(heightCm: number, weightKg: number): {
  bmi: number
  category: string
  asianCategory: string
  recommendation: string
} {
  const bmi = weightKg / Math.pow(heightCm / 100, 2)
  const rounded = Math.round(bmi * 10) / 10

  let category: string
  if (bmi < 18.5) category = 'Underweight'
  else if (bmi < 25) category = 'Normal weight'
  else if (bmi < 30) category = 'Overweight'
  else category = 'Obese'

  // WHO Asian-Pacific thresholds
  let asianCategory: string
  if (bmi < 18.5) asianCategory = 'Underweight'
  else if (bmi < 23) asianCategory = 'Normal weight (Asian)'
  else if (bmi < 27.5) asianCategory = 'Overweight (Asian)'
  else asianCategory = 'Obese (Asian)'

  let recommendation: string
  if (bmi < 23) recommendation = 'Your weight is in the healthy range for Asian populations.'
  else if (bmi < 27.5) recommendation = 'You are in the overweight range for Asian populations. This increases your risk of diabetes and cardiovascular disease.'
  else recommendation = 'You are in the obese range. This significantly increases your risk of several chronic diseases. Please discuss weight management with your doctor.'

  return { bmi: rounded, category, asianCategory, recommendation }
}
