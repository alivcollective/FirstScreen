// Symptom Checker — TypeScript types
// Supabase-ready field names (snake_case matches DB columns)

export type BodyRegion =
  | 'head'
  | 'chest'
  | 'abdomen'
  | 'back'
  | 'left-arm'
  | 'right-arm'
  | 'left-leg'
  | 'right-leg'
  | 'skin'
  | 'general'

export type SymptomSeverity = 'low' | 'medium' | 'high' | 'critical'

export type UrgencyLevel = 'emergency' | 'urgent' | 'appointment' | 'selfcare'

export interface Symptom {
  id: string
  label: string            // Thai label
  severity: SymptomSeverity
  region: BodyRegion
  relatedConditions: string[] // condition slugs
}

export interface LabTest {
  id: string
  name_th: string
  name_en: string
  purpose: string
  priority: 'essential' | 'recommended' | 'optional'
}

export interface Condition {
  id: string               // slug — matches DB column
  name_th: string
  name_en: string
  description_th: string   // 1-line description
  trigger_symptoms: string[] // symptom IDs
  lab_tests: LabTest[]
  recommended_specialty: string // specialty (Thai)
  urgency_hint: UrgencyLevel
  encyclopedia_slug: string    // /diseases/[slug]
  icd10?: string
}

export interface ConditionMatch {
  condition: Condition
  matched_symptoms: string[]
  score: number            // 0-100 match percentage
}

// ── Wizard State (managed by useReducer in page.tsx) ──────────

export interface WizardProfile {
  age: string
  sex: 'male' | 'female' | 'other' | ''
  smoking: boolean
  existing_conditions: string[]
}

export interface WizardFollowUp {
  duration: '' | 'less_24h' | '2_7d' | '1_4w' | 'more_1m'
  severity: number                         // 1-10
  progression: '' | 'worsening' | 'stable' | 'improving'
  // Conditional — cardiac
  sudden_onset: boolean | null
  cold_sweat: boolean | null
  // Conditional — bleeding
  blood_amount: 'small' | 'large' | null
  blood_first_time: boolean | null
  // Conditional — weight loss
  weight_loss_kg: string
  weight_loss_months: string
  // Conditional — fever
  max_temp: string
  has_rash: boolean | null
}

export interface WizardState {
  step: 1 | 2 | 3 | 4
  profile: WizardProfile
  selected_region: BodyRegion | null
  selected_symptoms: string[]
  custom_symptom: string
  follow_up: WizardFollowUp
}

export type WizardAction =
  | { type: 'SET_STEP'; step: WizardState['step'] }
  | { type: 'UPDATE_PROFILE'; field: keyof WizardProfile; value: string | boolean | string[] }
  | { type: 'SET_REGION'; region: BodyRegion | null }
  | { type: 'TOGGLE_SYMPTOM'; id: string }
  | { type: 'CLEAR_SYMPTOMS' }
  | { type: 'SET_CUSTOM_SYMPTOM'; text: string }
  | { type: 'UPDATE_FOLLOWUP'; field: keyof WizardFollowUp; value: string | number | boolean | null }
  | { type: 'RESET' }
