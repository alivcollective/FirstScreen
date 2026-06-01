/**
 * FINDRISC Tests — Asian-adjusted BMI cutoffs
 * Reference: Lindström & Tuomilehto 2003 + WHO Asian BMI 2004
 */

import { calculateFINDRISC } from '../risk-tools/findrisc'

describe('FINDRISC — Asian BMI thresholds', () => {
  const BASE_INPUT = {
    age: 40,
    sex: 'male' as const,
    waistCm: 80,
    exerciseMeets150MinPerWeek: true,
    eatsVegetablesDaily: true,
    hasHypertension: false,
    hasHighGlucoseHistory: false,
    familyDiabetes: 'none' as const,
  }

  test('BMI < 23 = 0 points (Asian normal)', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 22 })
    expect(result.breakdown.bmi).toBe(0)
  })

  test('BMI 23–27.4 = 1 point (Asian overweight)', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 25 })
    expect(result.breakdown.bmi).toBe(1)
  })

  test('BMI ≥ 27.5 = 3 points (Asian obese)', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 28 })
    expect(result.breakdown.bmi).toBe(3)
  })

  test('Thai waist ≥ 90cm (male) = 3 points', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 22, waistCm: 92 })
    expect(result.breakdown.waist).toBe(3)
  })

  test('Thai waist < 90cm (male) = 0 points', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 22, waistCm: 88 })
    expect(result.breakdown.waist).toBe(0)
  })

  test('Female waist ≥ 80cm = 3 points', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 22, waistCm: 82, sex: 'female' })
    expect(result.breakdown.waist).toBe(3)
  })

  test('No exercise = 2 points', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 22, exerciseMeets150MinPerWeek: false })
    expect(result.breakdown.exercise).toBe(2)
  })

  test('High glucose history = 5 points', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 22, hasHighGlucoseHistory: true })
    expect(result.breakdown.glucose_history).toBe(5)
  })

  test('First-degree family diabetes = 5 points', () => {
    const result = calculateFINDRISC({ ...BASE_INPUT, bmi: 22, familyDiabetes: 'first_degree' })
    expect(result.breakdown.family).toBe(5)
  })

  test('Low-risk profile: score < 7 = low risk level', () => {
    const result = calculateFINDRISC({
      age: 30, sex: 'male', bmi: 20, waistCm: 75,
      exerciseMeets150MinPerWeek: true,
      eatsVegetablesDaily: true,
      hasHypertension: false,
      hasHighGlucoseHistory: false,
      familyDiabetes: 'none',
    })
    expect(result.score).toBeLessThan(7)
    expect(result.riskLevel).toBe('low')
    expect(result.tenYearRiskPercent).toBe(1)
  })

  test('High-risk profile: score > 14', () => {
    const result = calculateFINDRISC({
      age: 60, sex: 'male', bmi: 30, waistCm: 100,
      exerciseMeets150MinPerWeek: false,
      eatsVegetablesDaily: false,
      hasHypertension: true,
      hasHighGlucoseHistory: false,
      familyDiabetes: 'first_degree',
    })
    expect(result.score).toBeGreaterThan(14)
    expect(['high', 'very_high']).toContain(result.riskLevel)
  })

  test('Very high risk: includes high glucose history', () => {
    const result = calculateFINDRISC({
      age: 65, sex: 'female', bmi: 29, waistCm: 88,
      exerciseMeets150MinPerWeek: false,
      eatsVegetablesDaily: false,
      hasHypertension: true,
      hasHighGlucoseHistory: true,
      familyDiabetes: 'first_degree',
    })
    expect(result.score).toBeGreaterThan(20)
    expect(result.riskLevel).toBe('very_high')
    expect(result.tenYearRiskPercent).toBe(50)
  })
})
