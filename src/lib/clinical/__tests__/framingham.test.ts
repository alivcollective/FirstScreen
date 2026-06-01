/**
 * Framingham CVD Risk Score — Validation Tests
 * Reference values from: Wilson PWF et al. Circulation 1998
 * and NHLBI online calculator
 */

import { calculateFramingham } from '../risk-tools/framingham'

describe('Framingham CVD Risk', () => {
  // ── Male reference cases ──────────────────────────────────

  test('low-risk male: age 40, optimal lipids, non-smoker', () => {
    const result = calculateFramingham({
      age: 40,
      sex: 'male',
      totalCholesterol: 160,
      hdlCholesterol: 60,
      systolicBP: 115,
      bpTreatment: false,
      smokingStatus: 'never',
      diabetes: false,
    })
    expect(result.tenYearRiskPercent).toBeLessThanOrEqual(5)
    expect(result.riskCategory).toBe('low')
  })

  test('high-risk male: age 60, high chol, smoker, HTN', () => {
    const result = calculateFramingham({
      age: 60,
      sex: 'male',
      totalCholesterol: 250,
      hdlCholesterol: 35,
      systolicBP: 155,
      bpTreatment: false,
      smokingStatus: 'current',
      diabetes: false,
    })
    expect(result.tenYearRiskPercent).toBeGreaterThanOrEqual(20)
    expect(result.riskCategory).toBe('very_high')
  })

  test('intermediate male: age 50, normal lipids, no other risk', () => {
    const result = calculateFramingham({
      age: 50,
      sex: 'male',
      totalCholesterol: 200,
      hdlCholesterol: 50,
      systolicBP: 130,
      bpTreatment: false,
      smokingStatus: 'never',
      diabetes: false,
    })
    expect(result.tenYearRiskPercent).toBeGreaterThanOrEqual(5)
    expect(result.tenYearRiskPercent).toBeLessThanOrEqual(15)
  })

  // ── Female reference cases ────────────────────────────────

  test('low-risk female: age 45, optimal', () => {
    const result = calculateFramingham({
      age: 45,
      sex: 'female',
      totalCholesterol: 170,
      hdlCholesterol: 60,
      systolicBP: 120,
      bpTreatment: false,
      smokingStatus: 'never',
      diabetes: false,
    })
    expect(result.tenYearRiskPercent).toBeLessThanOrEqual(5)
    expect(result.riskCategory).toBe('low')
  })

  test('high-risk female: age 65, multiple risk factors', () => {
    const result = calculateFramingham({
      age: 65,
      sex: 'female',
      totalCholesterol: 270,
      hdlCholesterol: 35,
      systolicBP: 165,
      bpTreatment: true,
      smokingStatus: 'current',
      diabetes: true,
    })
    expect(result.tenYearRiskPercent).toBeGreaterThanOrEqual(20)
    expect(result.riskCategory).toBe('very_high')
  })

  // ── BP treatment effect ───────────────────────────────────

  test('treated BP should score higher than untreated same SBP', () => {
    const base = {
      age: 55,
      sex: 'male' as const,
      totalCholesterol: 200,
      hdlCholesterol: 50,
      systolicBP: 140,
      smokingStatus: 'never' as const,
      diabetes: false,
    }
    const untreated = calculateFramingham({ ...base, bpTreatment: false })
    const treated = calculateFramingham({ ...base, bpTreatment: true })
    expect(treated.points).toBeGreaterThan(untreated.points)
  })

  // ── Recommendations ───────────────────────────────────────

  test('smoker gets smoking cessation recommendation', () => {
    const result = calculateFramingham({
      age: 45, sex: 'male',
      totalCholesterol: 200, hdlCholesterol: 50,
      systolicBP: 125, bpTreatment: false,
      smokingStatus: 'current', diabetes: false,
    })
    expect(result.recommendationsTh.some(r => r.includes('สูบบุหรี่'))).toBe(true)
  })
})
