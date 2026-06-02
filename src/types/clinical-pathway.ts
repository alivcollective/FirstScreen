// Clinical Pathway Types — FirstScreen
// "Design for doctors, not engineers."
// Doctors see: natural language + clinical concepts
// System handles: rules, scores, logic — hidden from doctors

export type PathwayStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived'
export type QuestionType = 'yes_no' | 'single_choice' | 'multiple_choice' | 'number' | 'text' | 'scale'
export type EmergencyLevel = 'call_1669' | 'go_to_er' | 'urgent_care' | 'see_doctor_today'
export type RecommendationType =
  | 'education' | 'self_care' | 'lifestyle' | 'exercise'
  | 'physical_therapy' | 'see_doctor' | 'urgent_care' | 'emergency'
export type EvidenceLevelPathway = 'high' | 'moderate' | 'low' | 'expert_consensus'
export type TranslationStatus = 'auto_suggested' | 'accepted' | 'edited' | 'rejected'

// Doctor-facing label for relationship strength
// Internal scores are computed by the DB: strongly_suggests=90, supports=70, etc.
export type RelationshipStrength = 'strongly_suggests' | 'supports' | 'possibly_related' | 'less_likely'

export const RELATIONSHIP_LABELS: Record<RelationshipStrength, string> = {
  strongly_suggests: 'บ่งชี้อย่างชัดเจน',
  supports: 'สนับสนุน',
  possibly_related: 'อาจเกี่ยวข้อง',
  less_likely: 'โอกาสน้อย',
}

export const EMERGENCY_LABELS: Record<EmergencyLevel, string> = {
  call_1669: 'โทร 1669 ทันที',
  go_to_er: 'ไปห้องฉุกเฉินทันที',
  urgent_care: 'พบแพทย์โดยด่วน',
  see_doctor_today: 'พบแพทย์ภายในวันนี้',
}

export const RECOMMENDATION_LABELS: Record<RecommendationType, string> = {
  education: 'ให้ความรู้',
  self_care: 'ดูแลตัวเอง',
  lifestyle: 'ปรับวิถีชีวิต',
  exercise: 'โปรแกรมออกกำลังกาย',
  physical_therapy: 'กายภาพบำบัด',
  see_doctor: 'พบแพทย์',
  urgent_care: 'พบแพทย์โดยด่วน',
  emergency: 'ฉุกเฉิน',
}

export const SPECIALTY_OPTIONS = [
  'เวชศาสตร์ทั่วไป',
  'อายุรศาสตร์โรคหัวใจ',
  'ออร์โธปิดิกส์',
  'เวชศาสตร์ฟื้นฟู',
  'เวชศาสตร์การกีฬา',
  'เวชศาสตร์ครอบครัว',
  'ประสาทวิทยา',
  'อายุรศาสตร์ระบบทางเดินหายใจ',
  'ศัลยศาสตร์',
  'นรีเวชวิทยา',
  'กุมารเวชศาสตร์',
] as const

// ── Pathway Draft (wizard state) ──────────────────────────────
// Full pathway data during creation

export interface PathwayDraft {
  id?: string
  // Step 1
  name_th: string
  name_en?: string
  description_th?: string
  description_en?: string
  specialty: string
  // Step 2
  body_regions: PathwayBodyRegion[]
  // Step 3
  symptoms: PathwaySymptom[]
  // Step 4
  questions: PathwayQuestion[]
  // Step 5
  conditions: PathwayCondition[]
  // Step 6
  red_flags: PathwayRedFlag[]
  // Step 7
  recommendations: PathwayRecommendation[]
  // Step 8
  references: PathwayReference[]
  // Step 9
  reviewer_name?: string
  reviewer_specialty?: string
  review_date?: string
  evidence_level?: EvidenceLevelPathway
  // Step 10
  translations: PathwayTranslation[]
  // Meta
  status: PathwayStatus
  links: PathwayLink[]
}

export const EMPTY_DRAFT: PathwayDraft = {
  name_th: '',
  specialty: 'เวชศาสตร์ทั่วไป',
  body_regions: [],
  symptoms: [],
  questions: [],
  conditions: [],
  red_flags: [],
  recommendations: [],
  references: [],
  translations: [],
  status: 'draft',
  links: [],
}

// ── Sub-entities ──────────────────────────────────────────────

export interface PathwayBodyRegion {
  id: string
  region_slug: string
  region_name_th: string
  region_name_en?: string
  sort_order: number
}

export interface PathwaySymptom {
  id: string
  symptom_slug: string
  name_th: string
  name_en?: string
  is_primary: boolean
  is_custom: boolean
  sort_order: number
}

export interface PathwayQuestion {
  id: string
  question_th: string
  question_en?: string
  question_type: QuestionType
  is_required: boolean
  hint_th?: string
  options: PathwayQuestionOption[]
  depends_on_id?: string
  depends_value?: string
  sort_order: number
}

export interface PathwayQuestionOption {
  id: string
  option_th: string
  option_en?: string
  sort_order: number
}

export interface PathwayCondition {
  id: string
  condition_slug: string
  condition_name_th: string
  condition_name_en?: string
  strength: RelationshipStrength
  notes_th?: string
  sort_order: number
}

export interface PathwayRedFlag {
  id: string
  name_th: string
  name_en?: string
  description_th: string
  description_en?: string
  emergency_level: EmergencyLevel
  action_th?: string
  action_en?: string
  sort_order: number
}

export interface PathwayRecommendation {
  id: string
  type: RecommendationType
  title_th: string
  title_en?: string
  detail_th?: string
  detail_en?: string
  condition_slug?: string
  sort_order: number
}

export interface PathwayReference {
  id: string
  source_org: string
  title_th?: string
  title_en?: string
  url?: string
  year?: number
  sort_order: number
}

export interface PathwayTranslation {
  id: string
  entity_type: string
  entity_id: string
  field_name: string
  source_text: string
  translation?: string
  status: TranslationStatus
}

export interface PathwayLink {
  id: string
  linked_type: string
  linked_id: string
  link_label_th?: string
  sort_order: number
}

// ── Full pathway from DB ──────────────────────────────────────

export interface ClinicalPathway extends PathwayDraft {
  id: string
  slug: string
  version: number
  is_public: boolean
  created_at: string
  updated_at: string
}

// ── Quick generate UUID ────────────────────────────────────────

export function makeId(): string {
  return typeof crypto !== 'undefined'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}
