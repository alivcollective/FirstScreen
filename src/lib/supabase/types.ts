// Supabase Database Type Definitions — Health Compass
// Auto-generated structure. Run `npx supabase gen types typescript` after connecting.
// These match /lib/supabase/migrations/001_initial_schema.sql exactly.

export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined }
  | Json[]

// ──────────────────────────────────────────────
// ROW SHAPES  (what SELECT * returns)
// ──────────────────────────────────────────────

export interface DiseaseRow {
  id: string                   // uuid
  slug: string
  name_th: string
  name_en: string
  name_th_short: string
  category: 'cancer' | 'heart' | 'diabetes' | 'mental' | 'respiratory' | 'infectious' | 'general'
  category_th: string
  icd10: string
  risk_level: 'low' | 'moderate' | 'high' | 'very_high'
  short_description_th: string
  content: Json                // Full RichDisease object stored as JSONB
  stats: Json                  // DiseaseStats object
  last_reviewed: string        // 'YYYY-MM'
  reviewed_by: string
  published: boolean
  created_at: string           // ISO timestamp
  updated_at: string
}

export interface SymptomRow {
  id: string
  name_th: string
  name_en: string
  body_region: 'head' | 'chest' | 'abdomen' | 'back' | 'arms' | 'legs' | 'skin' | 'general'
  severity_level: 'mild' | 'moderate' | 'severe' | 'critical'
  description_th: string
  frequency_note: string | null
  keywords: string[]
  created_at: string
}

export interface SymptomConditionRow {
  id: string
  symptom_ids: string[]        // array of symptom IDs
  condition_name_th: string
  condition_name_en: string
  urgency_level: 'emergency' | 'urgent' | 'appointment' | 'selfcare'
  description_th: string
  specialty_th: string
  specialty_en: string
  disease_slug: string | null  // FK to diseases.slug (nullable)
  suggested_tests_th: string[]
  red_flags_th: string[]
  min_score: number
  weights: Json                // Record<string, number>
  is_emergency: boolean
  created_at: string
}

export interface HospitalRow {
  id: string
  name_th: string
  name_en: string
  province: string
  district: string | null
  address: string | null
  lat: number | null
  lng: number | null
  specialties: string[]
  phone: string | null
  website: string | null
  email: string | null
  accreditations: string[]     // ['JCI', 'HA Thailand', etc.]
  insurance_accepted: string[]
  languages_spoken: string[]
  type: 'public' | 'private' | 'clinic'
  rating: number | null
  rating_count: number
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AssessmentResultRow {
  id: string
  session_id: string           // anonymous — browser-generated UUID
  assessment_type: 'diabetes' | 'cardiovascular' | 'mental_health' | 'cancer' | 'symptom_check'
  input_data: Json             // the form answers (anonymized)
  result_data: Json            // scores, risk level, action plan
  locale: string               // 'th' | 'en'
  user_age_band: string | null // '25-34', '35-44', etc. — never exact age
  user_sex: 'male' | 'female' | 'other' | null
  created_at: string
  // No user_id — fully anonymous for MVP
}

export interface RiskAssessmentRow {
  id: string
  type: 'diabetes' | 'cardiovascular' | 'mental_health' | 'cancer_breast' | 'cancer_cervical' | 'cancer_colorectal' | 'cancer_liver'
  version: string              // e.g. '2.0'
  name_th: string
  description_th: string
  schema: Json                 // question definitions for dynamic form rendering
  source_citation: string
  active: boolean
  created_at: string
}

// ──────────────────────────────────────────────
// INSERT SHAPES  (omit auto-generated fields)
// ──────────────────────────────────────────────

export type DiseaseInsert = Omit<DiseaseRow, 'id' | 'created_at' | 'updated_at'>
export type SymptomInsert = Omit<SymptomRow, 'id' | 'created_at'>
export type SymptomConditionInsert = Omit<SymptomConditionRow, 'id' | 'created_at'>
export type HospitalInsert = Omit<HospitalRow, 'id' | 'created_at' | 'updated_at'>
export type AssessmentResultInsert = Omit<AssessmentResultRow, 'id' | 'created_at'>
export type RiskAssessmentInsert = Omit<RiskAssessmentRow, 'id' | 'created_at'>

// ──────────────────────────────────────────────
// DATABASE  (passed to createClient<Database>)
// ──────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      diseases: {
        Row: DiseaseRow
        Insert: DiseaseInsert
        Update: Partial<DiseaseInsert>
      }
      symptoms: {
        Row: SymptomRow
        Insert: SymptomInsert
        Update: Partial<SymptomInsert>
      }
      symptom_conditions: {
        Row: SymptomConditionRow
        Insert: SymptomConditionInsert
        Update: Partial<SymptomConditionInsert>
      }
      hospitals: {
        Row: HospitalRow
        Insert: HospitalInsert
        Update: Partial<HospitalInsert>
      }
      assessment_results: {
        Row: AssessmentResultRow
        Insert: AssessmentResultInsert
        Update: never // insert-only
      }
      risk_assessments: {
        Row: RiskAssessmentRow
        Insert: RiskAssessmentInsert
        Update: Partial<RiskAssessmentInsert>
      }
    }
    Views: Record<string, never>
    Functions: {
      search_diseases: {
        Args: { query: string; category?: string }
        Returns: DiseaseRow[]
      }
      nearby_hospitals: {
        Args: { user_lat: number; user_lng: number; radius_km?: number }
        Returns: (HospitalRow & { distance_km: number })[]
      }
    }
    Enums: {
      disease_category: 'cancer' | 'heart' | 'diabetes' | 'mental' | 'respiratory' | 'infectious' | 'general'
      risk_level: 'low' | 'moderate' | 'high' | 'very_high'
      symptom_severity: 'mild' | 'moderate' | 'severe' | 'critical'
      urgency_level: 'emergency' | 'urgent' | 'appointment' | 'selfcare'
      hospital_type: 'public' | 'private' | 'clinic'
    }
  }
}

// ──────────────────────────────────────────────
// CONVENIENCE RE-EXPORTS
// ──────────────────────────────────────────────

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
