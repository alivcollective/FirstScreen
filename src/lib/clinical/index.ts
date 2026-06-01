// Clinical Assessment Engine — Public API
// All functions are educational tools, NOT diagnostic instruments.

export { calculatePackYears, getSmokingRisk, applySmokingModifier } from './calculators/pack-year'
export type { SmokingRisk } from './calculators/pack-year'

export { calculateAUDITC, calculateAUDITCFromScores } from './calculators/audit-c'
export type { AUDITCInput, AUDITCResult } from './calculators/audit-c'

export { calculateBMI, assessWaistRisk, getMetabolicRisk } from './calculators/bmi'
export type { BMIResult, WaistRiskResult } from './calculators/bmi'

export { calculateFramingham } from './risk-tools/framingham'
export type { FraminghamInput, FraminghamResult } from './risk-tools/framingham'

export { calculateFINDRISC } from './risk-tools/findrisc'
export type { FINDRISCInput, FINDRISCResult } from './risk-tools/findrisc'

export { assessCancerRisks } from './risk-tools/cancer-risk'
export type { CancerRiskInput, CancerRiskResult, ScreeningRecommendation } from './risk-tools/cancer-risk'

export { computeDifferentialDiagnosis, hasEmergencySymptom } from './differential-engine'

export { classifyUrgency } from './urgency-classifier'
export type { UrgencyOutput } from './urgency-classifier'
