// Clinical TypeScript Types — FirstScreen
// Matches Supabase tables in migrations/002_clinical_schema.sql
// Standards: ICD-11, OLDCARTS, AUDIT-C, PHQ-9, GAD-7

// ── Enum Types ───────────────────────────────────────────────

export type BodyRegion =
  | 'head' | 'chest' | 'abdomen' | 'back'
  | 'limbs' | 'skin' | 'general'

export type MedicalSystem =
  | 'neurological' | 'cardiovascular' | 'respiratory' | 'GI'
  | 'musculoskeletal' | 'dermatological' | 'psychiatric'
  | 'endocrine' | 'general'

export type ConditionCategory =
  | 'cancer' | 'cardiovascular' | 'endocrine' | 'infectious'
  | 'psychiatric' | 'neurological' | 'respiratory' | 'GI'
  | 'musculoskeletal' | 'other'

export type ConditionSeverity = 'mild' | 'moderate' | 'severe' | 'critical'

export type UrgencyLevel = 1 | 2 | 3 | 4
// 1 = routine appointment
// 2 = see doctor within 1-2 weeks
// 3 = urgent — see doctor within 24-48 hours
// 4 = emergency — go to ER / call 1669 now

export type SeverityWeight = 1 | 2 | 3 | 4
// 1 = low concern
// 2 = moderate
// 3 = high
// 4 = critical (triggers is_emergency flag)

export type FollowUpType = 'radio' | 'number' | 'boolean' | 'multi' | 'text' | 'select'

export type ConfidenceLevel = 'low' | 'moderate' | 'high'

export type SmokingStatus = 'never' | 'current' | 'former'
export type AlcoholStatus = 'never' | 'current' | 'former'

// ── Core Clinical Types ──────────────────────────────────────

export interface FollowUpQuestion {
  key: string
  q_th: string
  q_en?: string
  type: FollowUpType
  options?: string[]
  depends_on?: string        // key of question this depends on
  depends_value?: string     // value that must be set to show this question
}

export interface Symptom {
  id: string
  code: string               // ICD-11 code e.g. "MG30.0"
  name_th: string
  name_en: string
  body_region: BodyRegion
  system: MedicalSystem
  severity_weight: SeverityWeight
  is_emergency: boolean      // true = show 1669 banner immediately
  follow_up_questions: FollowUpQuestion[]
  created_at: string
}

export interface Condition {
  id: string
  icd11_code: string
  name_th: string
  name_en: string
  category: ConditionCategory
  severity: ConditionSeverity
  urgency_level: UrgencyLevel
  prevalence_thailand?: string
  specialty_required?: string
  encyclopedia_slug?: string
  created_at: string
}

export interface DifferentialDx {
  id: string
  condition_id: string
  symptom_id: string
  base_score: number          // 0.0–1.0

  // Demographic modifiers
  modifier_age_over_50: number
  modifier_age_over_60: number
  modifier_male: number
  modifier_female: number

  // Lifestyle modifiers
  modifier_smoker: number
  modifier_ex_smoker_5y: number
  modifier_heavy_alcohol: number
  modifier_obese: number
  modifier_sedentary: number

  // Comorbidity modifiers
  modifier_diabetes: number
  modifier_hypertension: number
  modifier_hbv: number
  modifier_hiv: number
  modifier_family_hx: number

  // Symptom characteristic modifiers
  modifier_duration_chronic: number
  modifier_duration_acute: number
  modifier_severity_high: number
  modifier_sudden_onset: number
  modifier_worsening: number
  modifier_night_predominant: number
}

// ── OLDCARTS Framework ────────────────────────────────────────
// Onset, Location, Duration, CHaracter, Aggravating, Relieving, Timing, Severity

export interface OLDCARTSData {
  onset_date?: string          // ISO date
  onset_description?: string   // "ทันที" | "ค่อยๆ เป็น"
  location?: string
  duration_days?: number
  character_description?: string
  aggravating_factors?: string[]
  relieving_factors?: string[]
  timing?: string              // "ตลอดเวลา" | "เป็นๆ หายๆ"
  severity_score?: number      // 1-10 NRS
  associated_symptoms?: string[]
  // OLDCARTS follow-up answers per symptom
  answers?: Record<string, string | number | boolean | string[]>
}

// ── Social History ────────────────────────────────────────────

export interface SmokingHistory {
  status: SmokingStatus
  cigarettes_per_day?: number
  years_smoked?: number
  pack_years?: number          // computed: (cigs/day ÷ 20) × years
  quit_years_ago?: number
}

export interface AlcoholHistory {
  status: AlcoholStatus
  // AUDIT-C responses
  audit_c_frequency?: string   // Q1 response
  audit_c_amount?: string      // Q2 response
  audit_c_binge?: string       // Q3 response
  audit_c_score?: number       // computed 0-12
  hazardous?: boolean          // score ≥3(F) or ≥4(M)
  years_drinking?: number
  quit_years_ago?: number
}

export interface ExerciseHistory {
  days_per_week?: number
  minutes_per_session?: number
  meets_who_guideline?: boolean  // ≥150 min/week moderate intensity
  mets_per_week?: number         // computed
}

export interface DietHistory {
  vegetable_servings?: string    // "<2" | "2-3" | "4-5" | "5+"
  red_meat_frequency?: string
  sugary_drinks?: string
}

export interface SocialHistory {
  smoking?: SmokingHistory
  alcohol?: AlcoholHistory
  exercise?: ExerciseHistory
  diet?: DietHistory
  bmi?: number
  height_cm?: number
  weight_kg?: number
}

// ── Family History ────────────────────────────────────────────

export interface FamilyHistory {
  first_degree?: {
    heart_disease?: boolean
    diabetes?: boolean
    cancer?: string             // type if known
    stroke?: boolean
    hypertension?: boolean
    breast_cancer?: boolean
    colorectal_cancer?: boolean
    liver_cancer?: boolean
  }
}

// ── Risk Assessment Results ───────────────────────────────────

export interface FraminghamResult {
  score?: number
  risk_pct: number
  risk_category: 'low' | 'moderate' | 'high' | 'very_high'
}

export interface FindriscResult {
  score: number
  risk_category: 'low' | 'slightly_elevated' | 'moderate' | 'high' | 'very_high'
  lifetime_risk_pct?: number
}

export interface PHQ9Result {
  score: number
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe'
  needs_immediate_assessment?: boolean  // Q9 > 0
}

export interface GAD7Result {
  score: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
}

export interface AUDITCResult {
  score: number
  hazardous: boolean
  interpretation: string
}

export interface RiskResults {
  framingham?: FraminghamResult
  findrisc?: FindriscResult
  phq9?: PHQ9Result
  gad7?: GAD7Result
  audit_c?: AUDITCResult
}

// ── Differential Diagnosis Results ───────────────────────────

export interface DifferentialResult {
  condition: Condition
  score: number               // 0-100 normalized
  confidence: ConfidenceLevel
  matched_symptoms: string[]  // symptom IDs that contributed
  key_modifiers: string[]     // modifier names that boosted score
}

// ── Clinical Session ──────────────────────────────────────────

export interface ClinicalSession {
  id?: string
  session_token: string       // browser-generated UUID

  // Demographics
  age?: number
  sex?: 'male' | 'female' | 'other'

  // Chief complaint
  chief_complaint?: string
  symptom_ids?: string[]

  // OLDCARTS
  oldcarts?: OLDCARTSData

  // Social History
  social_history?: SocialHistory

  // Past Medical History
  pmh_conditions?: string[]
  pmh_surgeries?: string[]
  pmh_allergies?: string[]
  current_medications?: string[]

  // Family History
  family_hx?: FamilyHistory

  // Computed Results
  differential_results?: DifferentialResult[]
  urgency_level?: UrgencyLevel
  recommended_actions?: string[]

  // Risk Tool Results
  risk_results?: RiskResults

  created_at?: string
  completed_at?: string
}

// ── Session Patient Profile (for score computation) ───────────

export interface SessionProfile {
  age?: number
  sex?: 'male' | 'female' | 'other'
  smoking?: SmokingHistory
  alcohol?: AlcoholHistory
  bmi?: number
  pmh?: {
    diabetes?: boolean
    hypertension?: boolean
    hbv?: boolean
    hiv?: boolean
  }
  family_hx?: {
    cvd?: boolean
    cancer?: boolean
  }
  symptom_severity?: number     // 1-10
  duration_days?: number
  worsening?: boolean
  sudden_onset?: boolean
}

// ── Scoring Computation Types ─────────────────────────────────

export interface SymptomScoreInput {
  symptom_id: string
  severity?: number
  duration_days?: number
  sudden_onset?: boolean
  worsening?: boolean
  night_predominant?: boolean
}

export interface DifferentialComputeInput {
  symptom_inputs: SymptomScoreInput[]
  profile: SessionProfile
}

// ── Risk Tool DB Types ─────────────────────────────────────────

export interface RiskToolQuestion {
  key: string
  q_th: string
  q_en?: string
  type: FollowUpType
  options?: string[]
  score_map?: Record<string, number>  // option → score
}

export interface RiskTool {
  id: string
  tool_key: string
  name_th: string
  name_en: string
  description_th?: string
  target_condition: string
  validated_population?: string
  reference_guideline?: string
  questions: RiskToolQuestion[]
  scoring_logic: {
    formula?: string
    max_score?: number
    note?: string
  }
  interpretation: Record<string, unknown>
  active: boolean
  version: string
}

// ── Social History Question DB Type ──────────────────────────

export interface SocialHistoryQuestion {
  id: string
  category: string
  question_key: string
  question_th: string
  question_en: string
  input_type: FollowUpType
  options?: string[]
  depends_on?: string
  depends_value?: string
  display_order: number
  clinical_weight?: string
}

// ── Urgency Config (UI) ───────────────────────────────────────

export const URGENCY_CONFIG = {
  1: {
    level: 1 as UrgencyLevel,
    label_th: 'นัดพบแพทย์',
    label_en: 'Schedule appointment',
    description_th: 'ควรนัดพบแพทย์ภายใน 1-2 สัปดาห์',
    color: 'emerald',
    emoji: '🟢',
  },
  2: {
    level: 2 as UrgencyLevel,
    label_th: 'พบแพทย์เร็วๆ นี้',
    label_en: 'See doctor soon',
    description_th: 'ควรพบแพทย์ภายใน 24-48 ชั่วโมง',
    color: 'amber',
    emoji: '🟡',
  },
  3: {
    level: 3 as UrgencyLevel,
    label_th: 'พบแพทย์ด่วน',
    label_en: 'Seek care urgently',
    description_th: 'ควรพบแพทย์หรือไปคลินิก/โรงพยาบาลโดยเร็ว',
    color: 'orange',
    emoji: '🟠',
  },
  4: {
    level: 4 as UrgencyLevel,
    label_th: 'ฉุกเฉิน — ไปห้องฉุกเฉินทันที',
    label_en: 'Emergency — go to ER now',
    description_th: 'โทร 1669 หรือไปห้องฉุกเฉินทันที อย่ารอดูอาการ',
    color: 'red',
    emoji: '🔴',
    hotline: '1669',
  },
} as const

// ── Helpers ───────────────────────────────────────────────────

export function computePackYears(
  cigarettesPerDay: number,
  yearsSmoked: number
): number {
  return (cigarettesPerDay / 20) * yearsSmoked
}

export function computeAUDITC(
  frequencyScore: number,   // 0-4
  amountScore: number,      // 0-4
  bingeScore: number        // 0-4
): { score: number; hazardous: boolean } {
  const score = frequencyScore + amountScore + bingeScore
  // Threshold: ≥3 for women, ≥4 for men
  // Returns hazardous flag based on general threshold ≥3
  return { score, hazardous: score >= 3 }
}

export function meetWHOExerciseGuideline(
  daysPerWeek: number,
  minutesPerSession: number
): boolean {
  return daysPerWeek * minutesPerSession >= 150
}

export function computeBMI(heightCm: number, weightKg: number): number {
  return Math.round((weightKg / Math.pow(heightCm / 100, 2)) * 10) / 10
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'น้ำหนักน้อย (Underweight)'
  if (bmi < 23)   return 'น้ำหนักปกติ (Normal — Asian standard)'
  if (bmi < 25)   return 'น้ำหนักเกินเล็กน้อย (Overweight I)'
  if (bmi < 30)   return 'น้ำหนักเกิน (Overweight II)'
  return 'อ้วน (Obese)'
}

// Normalize score to 0-100
export function normalizeScore(raw: number, max: number = 1): number {
  return Math.round(Math.min(raw / max, 1) * 100)
}
