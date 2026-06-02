// FirstScreen — Phase 1 Medical Types
// Mirrors 005_phase1_schema.sql extensions and new tables

// ── Enums ─────────────────────────────────────────────────────

export type ContentStatus =
  | 'draft'
  | 'pending_review'
  | 'needs_revision'
  | 'approved'
  | 'published'
  | 'archived'

export type MedicalEvidenceLevel =
  | 'high'
  | 'moderate'
  | 'low'
  | 'expert_opinion'

export type Specialty =
  | 'general'
  | 'internal_medicine'
  | 'cardiology'
  | 'neurology'
  | 'orthopedics'
  | 'gastroenterology'
  | 'pulmonology'
  | 'endocrinology'
  | 'psychiatry'
  | 'dermatology'
  | 'oncology'
  | 'surgery'
  | 'emergency'
  | 'pediatrics'
  | 'obgyn'
  | 'urology'
  | 'nephrology'
  | 'rheumatology'
  | 'hematology'
  | 'infectious_disease'

export type ConfidenceLevel =
  | 'strongly_suggests'
  | 'supports'
  | 'possibly_related'
  | 'less_likely'

export type SymptomFrequency =
  | 'very_common'
  | 'common'
  | 'uncommon'
  | 'rare'

export type SourceType =
  | 'guideline'
  | 'systematic_review'
  | 'rct'
  | 'cohort'
  | 'case_series'
  | 'expert_opinion'
  | 'textbook'

export type AgeGroup = 'all' | 'child' | 'teen' | 'adult' | 'elderly'
export type SexPredominant = 'all' | 'male' | 'female'
export type ConditionSeverity = 'mild' | 'moderate' | 'severe' | 'critical'

// ── Body Region ───────────────────────────────────────────────

export interface BodyRegion {
  id: string
  slug: string
  name_th: string
  name_en: string
  parent_id: string | null
  coord_front_x: number | null
  coord_front_y: number | null
  coord_back_x: number | null
  coord_back_y: number | null
  display_order: number
  tags: string[]
  status: ContentStatus
  embeddings_placeholder: Record<string, unknown> | null
  created_at: string
}

// ── Symptom (extended from 002 + 005) ────────────────────────

export interface Symptom {
  id: string
  code: string
  name_th: string
  name_en: string
  body_region: string
  system: string
  severity_weight: 1 | 2 | 3 | 4
  is_emergency: boolean
  follow_up_questions: unknown[]
  slug: string | null
  aliases: string[]
  tags: string[]
  description_th: string | null
  status: ContentStatus
  embeddings_placeholder: Record<string, unknown> | null
  created_at: string
  updated_at: string | null
}

// ── Condition (extended from 002 + 005) ──────────────────────

export interface Condition {
  id: string
  icd11_code: string
  name_th: string
  name_en: string
  category: string
  severity: ConditionSeverity
  urgency_level: 1 | 2 | 3 | 4
  prevalence_thailand: string | null
  specialty_required: string | null
  encyclopedia_slug: string | null
  slug: string | null
  aliases: string[]
  tags: string[]
  description_th: string | null
  description_en: string | null
  age_group: AgeGroup | null
  sex_predominant: SexPredominant | null
  evidence_level: MedicalEvidenceLevel | null
  reviewer_name: string | null
  reviewed_at: string | null
  expires_at: string | null
  disclaimer_th: string | null
  status: ContentStatus
  embeddings_placeholder: Record<string, unknown> | null
  created_at: string
  updated_at: string | null
  symptoms?: ConditionSymptom[]
  references?: MedicalReference[]
  regions?: BodyRegion[]
}

// ── Clinical Pathway (extended from 004 + 005) ────────────────

export interface ClinicalPathway {
  id: string
  slug: string
  name_th: string
  name_en: string | null
  description_th: string | null
  description_en: string | null
  specialty: string
  status: string
  reviewer_id: string | null
  reviewer_name: string | null
  reviewer_specialty: string | null
  review_date: string | null
  evidence_level: string | null
  version: number
  is_public: boolean
  created_by: string | null
  screening_questions: ScreeningQuestion[]
  red_flags: RedFlag[]
  recommendations: Recommendation[]
  expires_at: string | null
  disclaimer_th: string | null
  tags: string[]
  aliases: string[]
  embeddings_placeholder: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

// ── Junction Types ────────────────────────────────────────────

export interface ConditionSymptom {
  condition_id: string
  symptom_id: string
  is_primary: boolean
  frequency: SymptomFrequency | null
  symptom?: Symptom
}

export interface PathwayCondition {
  pathway_id: string
  condition_id: string
  confidence_level: ConfidenceLevel
  display_order: number
  condition?: Condition
}

export interface PathwaySymptom {
  pathway_id: string
  symptom_id: string
  is_primary: boolean
  symptom?: Symptom
}

export interface PathwayRegion {
  pathway_id: string
  region_id: string
  region?: BodyRegion
}

// ── Medical Reference ─────────────────────────────────────────

export interface MedicalReference {
  id: string
  source_type: SourceType
  title: string
  authors: string | null
  journal: string | null
  publication_year: number | null
  url: string | null
  doi: string | null
  pmid: string | null
  evidence_level: MedicalEvidenceLevel | null
  created_at: string
}

// ── Screening / Red Flags / Recommendations (JSONB shapes) ───

export interface ScreeningQuestion {
  id: string
  question_th: string
  question_en: string | null
  type: 'yes_no' | 'single_choice' | 'multiple_choice' | 'number' | 'scale'
  options: string[] | null
  red_flag_trigger: string | null
  confidence_modifier: number
}

export interface RedFlag {
  title_th: string
  description_th: string
  urgency: 'call_1669' | 'go_to_er' | 'urgent_care' | 'see_doctor_today'
  action: string
}

export interface Recommendation {
  type: string
  title_th: string
  description_th: string
  evidence_level: MedicalEvidenceLevel
}

// ── Form Input Types ──────────────────────────────────────────

export interface ConditionFormData {
  name_th: string
  name_en: string
  icd11_code: string
  specialty: string
  category: string
  severity: ConditionSeverity | ''
  urgency_level: 1 | 2 | 3 | 4 | null
  description_th: string
  aliases: string[]
  tags: string[]
  age_group: AgeGroup | ''
  sex_predominant: SexPredominant | ''
  evidence_level: MedicalEvidenceLevel | ''
  reviewer_name: string
  disclaimer_th: string
}

export interface PathwayFormData {
  name_th: string
  name_en: string
  specialty: string
  description_th: string
  screening_questions: ScreeningQuestion[]
  red_flags: RedFlag[]
  recommendations: Recommendation[]
  evidence_level: MedicalEvidenceLevel | ''
  reviewer_name: string
  disclaimer_th: string
  tags: string[]
  aliases: string[]
}

// ── AI Autofill ───────────────────────────────────────────────

export interface AIAutofillRequest {
  name_th: string
}

export interface AIAutofillResponse {
  name_en: string
  description_th: string
  icd11_suggestion: string
  aliases: string[]
  symptoms: string[]
  red_flags: string[]
  age_group: AgeGroup | null
  sex_predominant: SexPredominant | null
  evidence_level: MedicalEvidenceLevel | null
  references: Array<{
    title: string
    source: string
    year: number | null
  }>
}

export interface AIUsageStatus {
  used: number
  limit: number
  remaining: number
  resets_at: string
}

// ── List / Query Options ──────────────────────────────────────

export interface ConditionListOptions {
  status?: ContentStatus
  specialty?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface PaginatedConditions {
  data: Condition[]
  total: number
  page: number
  pageSize: number
}
