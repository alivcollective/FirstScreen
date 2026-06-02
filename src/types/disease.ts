// Rich Disease Type System for FirstScreen Disease Library
// SAFETY: Educational content only — NOT medical advice

export type DiseaseCategory = 'cancer' | 'heart' | 'diabetes' | 'mental' | 'respiratory' | 'infectious' | 'general'
export type SymptomSeverity = 'mild' | 'moderate' | 'severe' | 'red_flag'
export type RiskType = 'modifiable' | 'non_modifiable' | 'partially_modifiable'
export type EvidenceType = 'guideline' | 'systematic_review' | 'rct' | 'cohort' | 'expert_consensus'
export type PreventionImpact = 'high' | 'medium' | 'low'

export interface DiseaseSymptom {
  id: string
  nameTh: string
  nameEn: string
  severity: SymptomSeverity
  descriptionTh: string
  frequencyNote?: string // e.g., "พบใน 70-80% ของผู้ป่วย"
}

export interface RiskFactor {
  nameTh: string
  nameEn?: string
  type: RiskType
  descriptionTh: string
  relativeRisk?: string // e.g., "เพิ่มความเสี่ยง 2 เท่า"
}

export interface ScreeningTest {
  id: string
  nameTh: string
  nameEn: string
  ageRange: string
  sex: 'male' | 'female' | 'all'
  frequency: string
  descriptionTh: string
  isNHSOCovered: boolean
  guidelineSource: string
}

export interface TreatmentOption {
  categoryTh: string
  nameTh: string
  nameEn?: string
  descriptionTh: string
  forStage?: string
  sideEffectsTh?: string[]
}

export interface PreventionAction {
  actionTh: string
  descriptionTh: string
  impact: PreventionImpact
  evidence: string
}

export interface DiseaseReference {
  id: string
  titleEn: string
  titleTh?: string
  organization?: string
  year: number
  url?: string
  doi?: string
  type: EvidenceType
  isVerified: boolean
  pendingNote?: string
}

export interface DiseaseStats {
  prevalenceThailand: string
  prevalenceThai: string
  primaryRiskGroupTh: string
  survivalRate?: string
  mortalityRankTh?: string
  newCasesPerYearTh?: string
}

// The full rich disease data structure
export interface RichDisease {
  slug: string
  nameTh: string
  nameEn: string
  nameTh_short: string
  category: DiseaseCategory
  categoryTh: string
  icd10: string
  lastReviewed: string
  reviewedBy: string
  reviewerPlaceholder?: string // alias for backward compat
  shortDescriptionTh: string
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high'

  stats: DiseaseStats

  overviewTh: string // 2-3 paragraphs, HTML-safe

  symptoms: DiseaseSymptom[]
  redFlagsTh: string[]

  causesTh: string[]

  riskFactors: RiskFactor[]

  screening: ScreeningTest[]

  treatments: TreatmentOption[]

  prevention: PreventionAction[]

  whenToSeeDoctorTh: string[]

  faqsTh: Array<{ questionTh: string; answerTh: string }>

  references: DiseaseReference[]
  relatedDiseases: string[] // slugs
  keywords: string[]
}

// Lightweight card data for listing pages
export interface DiseaseCard {
  slug: string
  nameTh: string
  nameTh_short: string
  nameEn: string
  category: DiseaseCategory
  categoryTh: string
  icd10: string
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high'
  shortDescriptionTh: string
  stats: Pick<DiseaseStats, 'prevalenceThailand' | 'primaryRiskGroupTh'>
  lastReviewed: string
}

export function toCard(d: RichDisease): DiseaseCard {
  return {
    slug: d.slug,
    nameTh: d.nameTh,
    nameTh_short: d.nameTh_short,
    nameEn: d.nameEn,
    category: d.category,
    categoryTh: d.categoryTh,
    icd10: d.icd10,
    riskLevel: d.riskLevel,
    shortDescriptionTh: d.shortDescriptionTh,
    stats: { prevalenceThailand: d.stats.prevalenceThailand, primaryRiskGroupTh: d.stats.primaryRiskGroupTh },
    lastReviewed: d.lastReviewed,
  }
}

export const CATEGORY_META: Record<DiseaseCategory, { labelTh: string; color: string; bg: string; border: string }> = {
  cancer:      { labelTh: 'มะเร็ง',          color: 'text-violet-700', bg: 'bg-violet-50',  border: 'border-violet-200' },
  heart:       { labelTh: 'หัวใจและหลอดเลือด', color: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-200' },
  diabetes:    { labelTh: 'เบาหวาน',          color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200' },
  mental:      { labelTh: 'สุขภาพจิต',        color: 'text-cyan-700',   bg: 'bg-cyan-50',    border: 'border-cyan-200' },
  respiratory: { labelTh: 'ระบบทางเดินหายใจ', color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200' },
  infectious:  { labelTh: 'โรคติดเชื้อ',      color: 'text-orange-700', bg: 'bg-orange-50',  border: 'border-orange-200' },
  general:     { labelTh: 'ทั่วไป',           color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200' },
}

export const SEVERITY_META: Record<SymptomSeverity, { labelTh: string; color: string; bg: string; border: string; dot: string }> = {
  mild:     { labelTh: 'เบา',      color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  moderate: { labelTh: 'ปานกลาง', color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500' },
  severe:   { labelTh: 'รุนแรง',  color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200',  dot: 'bg-orange-500' },
  red_flag: { labelTh: '⚠ เตือน', color: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-300',     dot: 'bg-red-500' },
}

export const IMPACT_META: Record<PreventionImpact, { labelTh: string; color: string; bg: string }> = {
  high:   { labelTh: 'ผลสูง',   color: 'text-emerald-700', bg: 'bg-emerald-100' },
  medium: { labelTh: 'ผลปานกลาง', color: 'text-amber-700',   bg: 'bg-amber-100' },
  low:    { labelTh: 'ผลพอมี',  color: 'text-slate-600',   bg: 'bg-slate-100' },
}
