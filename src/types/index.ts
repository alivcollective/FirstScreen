export type Language = 'th' | 'en' | 'zh' | 'ja' | 'ko' | 'ms' | 'vi' | 'id'
export type Country = 'TH' | 'SG' | 'MY' | 'VN' | 'ID' | 'PH' | 'JP' | 'KR' | 'CN' | 'IN'
export type EvidenceGrade = 'A' | 'B' | 'C' | 'D'
export type RiskCategory = 'low' | 'moderate' | 'high' | 'very_high'
export type UrgencyLevel = 'routine' | 'soon' | 'urgent' | 'emergency'
export type BiologicalSex = 'male' | 'female' | 'intersex' | 'prefer_not_to_say'

export interface User {
  id: string
  countryCode: Country
  preferredLanguage: Language
  createdAt: string
}

export interface HealthProfile {
  userId: string
  birthYear: number
  biologicalSex: BiologicalSex
  heightCm: number
  weightKg: number
  countryCode: Country
  province?: string
  isSmoker: boolean
  smokingPackYears?: number
  alcoholUnitsPerWeek: number
  exerciseDaysPerWeek: number
  familyHistory: FamilyHistoryItem[]
}

export interface FamilyHistoryItem {
  conditionId: string
  conditionName: string
  relationship: 'parent' | 'sibling' | 'grandparent' | 'aunt_uncle'
  ageOfOnset?: number
}

export interface Condition {
  id: string
  icd10Code?: string
  slug: string
  name: string
  shortDescription: string
  fullDescription?: string
  symptoms?: string
  riskFactors?: string
  prevention?: string
  treatmentOverview?: string
  whenToSeeDoctor?: string
  evidenceGrade: EvidenceGrade
  lastReviewedAt: string
  reviewerName?: string
  reviewerCredentials?: string[]
  sources?: EvidenceSource[]
}

export interface EvidenceSource {
  name: string
  type: 'systematic_review' | 'rct' | 'guideline' | 'expert_opinion' | 'meta_analysis'
  url?: string
  doi?: string
  year?: number
}

export interface Symptom {
  id: string
  slug: string
  name: string
  description?: string
  bodySystem: string
  urgencyLevel: UrgencyLevel
}

export interface SymptomNavigationResult {
  symptoms: Symptom[]
  urgencyLevel: UrgencyLevel
  careRecommendation: 'self_care' | 'gp' | 'specialist' | 'emergency'
  careRecommendationText: string
  relatedConditions: Condition[]
  disclaimer: string
  nextSteps: string[]
}

export interface ScreeningTest {
  id: string
  slug: string
  name: string
  description: string
  conditionId?: string
  conditionName?: string
  testType: 'blood_test' | 'imaging' | 'physical_exam' | 'questionnaire' | 'biopsy'
  preparationInstructions?: string
  whatToExpect?: string
}

export interface ScreeningGuideline {
  id: string
  screeningTestId: string
  countryCode: Country
  issuingOrganization: string
  guidelineName: string
  guidelineUrl?: string
  minAge?: number
  maxAge?: number
  biologicalSex: 'all' | 'male' | 'female'
  frequencyMonths: number
  isUniversal: boolean
  additionalCriteria?: Record<string, unknown>
}

export interface ScreeningPlanItem {
  screeningTest: ScreeningTest
  guideline: ScreeningGuideline
  recommendedDate: string
  completedDate?: string
  reminderEnabled: boolean
  isOverdue: boolean
  daysUntilDue?: number
}

export interface RiskAssessmentResult {
  calculatorId: string
  calculatorName: string
  category: string
  riskCategory: RiskCategory
  riskPercentage?: number
  riskLabel: string
  score?: number
  interpretation: string
  actionPlan: ActionItem[]
  createdAt: string
}

export interface ActionItem {
  priority: 'immediate' | 'soon' | 'ongoing'
  category: 'screening' | 'lifestyle' | 'medical' | 'monitoring'
  title: string
  description: string
  actionUrl?: string
}

export interface HealthcareProvider {
  id: string
  slug: string
  name: string
  organizationType: 'hospital' | 'clinic' | 'specialist_center' | 'screening_center'
  countryCode: Country
  city: string
  address: ProviderAddress
  coordinates?: { lat: number; lng: number }
  phone?: string
  website?: string
  accreditations: string[]
  languagesSpoken: Language[]
  insuranceAccepted: string[]
  rating?: number
  ratingCount?: number
  isVerified: boolean
  services?: ProviderService[]
}

export interface ProviderAddress {
  street?: string
  district?: string
  city: string
  province: string
  postalCode?: string
  countryCode: Country
}

export interface ProviderService {
  id: string
  serviceType: string
  screeningTestId?: string
  screeningTestName?: string
  priceThb?: number
  priceUsd?: number
  durationMinutes?: number
  appointmentRequired: boolean
  bookingUrl?: string
}

export interface CourseModule {
  id: string
  sequenceNumber: number
  moduleType: 'video' | 'text' | 'quiz' | 'infographic'
  title: string
  videoUrl?: string
  content?: unknown
  durationMinutes?: number
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  category: string
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes: number
  certificateAvailable: boolean
  modules: CourseModule[]
  thumbnailUrl?: string
  authorName?: string
  authorCredentials?: string[]
}

export interface PopulationMetric {
  metricType: string
  countryCode: Country
  region?: string
  conditionSlug?: string
  periodStart: string
  periodEnd: string
  metricValue: number
  sampleSize: number
}

export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
  badge?: string
}
