// Knowledge Management System Types — FirstScreen
// Mirrors 003_kms_schema.sql

export type ArticleStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived'
export type EvidenceLevel = 'high' | 'moderate' | 'low' | 'insufficient'
export type ContentLanguage = 'th' | 'en' | 'both'
export type UrgencyType = 'emergency' | 'urgent' | 'routine' | 'self_care' | 'monitor'

// ── Authors ───────────────────────────────────────────────────

export interface KmsAuthor {
  id: string
  name: string
  title?: string
  specialty?: string
  credential?: string
  bio_th?: string
  bio_en?: string
  avatar_url?: string
  is_reviewer: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Category ──────────────────────────────────────────────────

export interface KmsCategory {
  id: string
  slug: string
  name_th: string
  name_en: string
  parent_id?: string
  color: string
  is_active: boolean
  sort_order: number
}

// ── Reference ─────────────────────────────────────────────────

export interface KmsReference {
  id: string
  source_org: string
  title: string
  title_en?: string
  url?: string
  doi?: string
  pubmed_id?: string
  year?: number
  evidence_level: EvidenceLevel
  guideline_name?: string
  is_verified: boolean
  notes?: string
  created_at: string
}

// ── Article ───────────────────────────────────────────────────

export interface KmsArticle {
  id: string
  slug: string
  title_th: string
  title_en?: string
  excerpt_th?: string
  excerpt_en?: string
  content: Record<string, unknown>  // TipTap JSON
  language: ContentLanguage
  category_id?: string
  category?: KmsCategory
  tags: string[]
  status: ArticleStatus
  author_id?: string
  author?: KmsAuthor
  reviewer_id?: string
  reviewer?: KmsAuthor
  review_date?: string
  review_notes?: string
  published_at?: string
  archived_at?: string
  evidence_level?: EvidenceLevel
  is_pending_review: boolean
  medical_disclaimer?: string
  seo_title?: string
  seo_description?: string
  seo_keywords: string[]
  og_image_url?: string
  canonical_url?: string
  read_time_minutes: number
  view_count: number
  is_featured: boolean
  ai_summary?: string
  created_at: string
  updated_at: string
}

export interface KmsArticleInput {
  slug?: string
  title_th: string
  title_en?: string
  excerpt_th?: string
  excerpt_en?: string
  content?: Record<string, unknown>
  content_th?: string    // plain text for DB storage / fallback
  content_en?: string
  category_id?: string
  tags?: string[]
  status?: ArticleStatus
  author_id?: string
  // Displayed author name (free text, no FK required for simple CMS)
  author_name?: string
  // Medical review
  reviewed_by?: string
  medical_reviewer?: string
  review_date?: string
  // References (free text block)
  references?: string
  evidence_level?: EvidenceLevel
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  og_image_url?: string
  cover_image_url?: string
  canonical_url?: string
  read_time_minutes?: number
  is_featured?: boolean
  published_at?: string
}

// ── Condition ─────────────────────────────────────────────────

export interface KmsCondition {
  id: string
  slug: string
  name_th: string
  name_en: string
  icd10_code?: string
  icd11_code?: string
  description_th?: string
  description_en?: string
  category?: string
  body_regions: string[]
  sport_relevance: string[]
  symptoms: string[]
  risk_factors: string[]
  red_flags: { text_th: string; urgency: UrgencyType }[]
  screening_tool?: string
  recommendations: { text_th: string }[]
  evidence_level: EvidenceLevel
  urgency: UrgencyType
  is_athlete_condition: boolean
  is_active: boolean
  ai_summary?: string
  created_at: string
  updated_at: string
}

// ── Symptom ───────────────────────────────────────────────────

export interface KmsSymptom {
  id: string
  slug: string
  name_th: string
  name_en: string
  description_th?: string
  body_regions: string[]
  severity: string
  is_emergency: boolean
  emergency_note_th?: string
  possible_conditions: string[]
  icd11_code?: string
  is_active: boolean
  created_at: string
}

// ── Body Region ───────────────────────────────────────────────

export interface KmsBodyRegion {
  id: string
  slug: string
  name_th: string
  name_en: string
  category?: string
  svg_front?: Record<string, unknown>
  svg_back?: Record<string, unknown>
  svg_label_front?: { x: number; y: number }
  svg_label_back?: { x: number; y: number }
  possible_symptoms: string[]
  related_conditions: string[]
  is_active: boolean
  created_at: string
}

// ── Athlete Condition ─────────────────────────────────────────

export interface KmsAthleteCondition {
  id: string
  slug: string
  name_th: string
  name_en: string
  related_regions: string[]
  relevant_sports: string[]
  trigger_activities: string[]
  symptoms: string[]
  description_th?: string
  red_flags: { text_th: string; urgency: UrgencyType }[]
  recommendations: { text_th: string }[]
  when_to_seek_help_th?: string
  urgency: UrgencyType
  evidence_level: EvidenceLevel
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Analytics ─────────────────────────────────────────────────

export type AnalyticsEventType =
  | 'article_view'
  | 'assessment_start'
  | 'assessment_complete'
  | 'body_map_click'
  | 'athlete_map_click'
  | 'symptom_select'
  | 'condition_view'
  | 'search'

export interface KmsAnalyticsEvent {
  event_type: AnalyticsEventType
  entity_type?: string
  entity_id?: string
  entity_slug?: string
  session_id?: string
  metadata?: Record<string, unknown>
}

// ── Pagination ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface KmsListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: ArticleStatus
  category?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}
