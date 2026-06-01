/**
 * Unit tests for clinical calculators
 * Run: npx jest src/lib/clinical/__tests__/calculators.test.ts
 */

import { calculatePackYears, getSmokingRisk } from '../calculators/pack-year'
import { calculateAUDITC } from '../calculators/audit-c'
import { calculateBMI, assessWaistRisk } from '../calculators/bmi'

// ── Pack-Year Tests ──────────────────────────────────────────

describe('calculatePackYears', () => {
  test('20 cigarettes/day × 10 years = 10 pack-years', () => {
    expect(calculatePackYears(20, 10)).toBe(10)
  })

  test('40 cigarettes/day × 20 years = 40 pack-years', () => {
    expect(calculatePackYears(40, 20)).toBe(40)
  })

  test('10 cigarettes/day × 5 years = 2.5 pack-years', () => {
    expect(calculatePackYears(10, 5)).toBe(2.5)
  })

  test('0 cigarettes returns 0', () => {
    expect(calculatePackYears(0, 10)).toBe(0)
  })

  test('0 years returns 0', () => {
    expect(calculatePackYears(20, 0)).toBe(0)
  })
})

describe('getSmokingRisk', () => {
  test('never smoker (0 pack-years) = none level', () => {
    expect(getSmokingRisk(0).level).toBe('none')
  })

  test('5 pack-years = low', () => {
    expect(getSmokingRisk(5).level).toBe('low')
  })

  test('15 pack-years = moderate', () => {
    expect(getSmokingRisk(15).level).toBe('moderate')
  })

  test('25 pack-years = high + NLST eligible', () => {
    const result = getSmokingRisk(25)
    expect(result.level).toBe('high')
    expect(result.nlstEligible).toBe(true)
  })

  test('20 pack-years quit 20 years ago = NLST eligible but reduced risk', () => {
    const result = getSmokingRisk(20, 20)
    expect(result.nlstEligible).toBe(true)
    expect(['low', 'moderate']).toContain(result.level) // long-term quitter, borderline
  })

  test('45 pack-years = very_high', () => {
    expect(getSmokingRisk(45).level).toBe('very_high')
  })
})

// ── AUDIT-C Tests ────────────────────────────────────────────

describe('calculateAUDITC', () => {
  test('non-drinker = score 0, low risk', () => {
    const result = calculateAUDITC({
      frequencyKey: 'ไม่เคยดื่ม',
      amountKey: '1–2 แก้ว',
      bingeKey: 'ไม่เคย',
      sex: 'male',
    })
    expect(result.score).toBe(0)
    expect(result.risk).toBe('low')
    expect(result.hazardous).toBe(false)
  })

  test('daily drinker with binge = high score, hazardous', () => {
    const result = calculateAUDITC({
      frequencyKey: '4 ครั้งขึ้นไป/สัปดาห์',
      amountKey: '7–9 แก้ว',
      bingeKey: 'สัปดาห์ละครั้ง',
      sex: 'male',
    })
    expect(result.score).toBe(10) // 4+3+3
    expect(result.hazardous).toBe(true)
    expect(result.risk).toBe('harmful')
  })

  test('female hazardous cutoff = 3', () => {
    const result = calculateAUDITC({
      frequencyKey: '2–4 ครั้ง/เดือน',
      amountKey: '1–2 แก้ว',
      bingeKey: 'น้อยกว่าเดือนละครั้ง',
      sex: 'female',
    })
    // Q1=2, Q2=0, Q3=1 → score=3
    expect(result.score).toBe(3)
    expect(result.hazardous).toBe(true) // ≥3 for female
  })

  test('male non-hazardous below cutoff of 4', () => {
    const result = calculateAUDITC({
      frequencyKey: '2–4 ครั้ง/เดือน',
      amountKey: '1–2 แก้ว',
      bingeKey: 'น้อยกว่าเดือนละครั้ง',
      sex: 'male',
    })
    // Q1=2, Q2=0, Q3=1 → score=3 — NOT hazardous for male (cutoff 4)
    expect(result.score).toBe(3)
    expect(result.hazardous).toBe(false)
  })
})

// ── BMI Tests ────────────────────────────────────────────────

describe('calculateBMI', () => {
  test('normal Asian BMI (170cm, 65kg = BMI 22.5)', () => {
    const result = calculateBMI(65, 170)
    expect(result.bmi).toBe(22.5)
    expect(result.categoryAsian).toBe('normal')
  })

  test('Asian overweight (170cm, 70kg = BMI 24.2)', () => {
    const result = calculateBMI(70, 170)
    expect(result.bmi).toBe(24.2)
    expect(result.categoryAsian).toBe('at_risk')
  })

  test('Asian obese (170cm, 83kg = BMI 28.7)', () => {
    const result = calculateBMI(83, 170)
    expect(result.bmi).toBe(28.7)
    expect(result.categoryAsian).toBe('obese_1')
  })
})

describe('assessWaistRisk', () => {
  test('male < 90cm = not at risk', () => {
    expect(assessWaistRisk(85, 'male').isAtRisk).toBe(false)
  })

  test('male ≥ 90cm = at risk', () => {
    expect(assessWaistRisk(90, 'male').isAtRisk).toBe(true)
  })

  test('female < 80cm = not at risk', () => {
    expect(assessWaistRisk(79, 'female').isAtRisk).toBe(false)
  })

  test('female ≥ 80cm = at risk', () => {
    expect(assessWaistRisk(80, 'female').isAtRisk).toBe(true)
  })
})
