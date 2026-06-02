// Athlete Pain Map Type System — FirstScreen
// Phase 3 — Not yet exposed in UI. Architecture ready.
// SAFETY: Educational only. NOT diagnostic.

export type AthleteMode =
  | 'general'
  | 'runner'
  | 'trail_runner'
  | 'cyclist'
  | 'strength_training'
  | 'crossfit'
  | 'yoga'

export type AthleteRegionId =
  | 'SCAPULA'
  | 'ROTATOR_CUFF'
  | 'SHOULDER'
  | 'PEC'
  | 'LAT'
  | 'BICEPS_TENDON'
  | 'ELBOW'
  | 'FOREARM'
  | 'WRIST'
  | 'HIP_FLEXOR'
  | 'GLUTE'
  | 'HAMSTRING'
  | 'QUAD'
  | 'IT_BAND'
  | 'PATELLA'
  | 'ACHILLES'
  | 'CALF'
  | 'PLANTAR_FASCIA'

export interface AthleteCondition {
  id: string
  name_th: string
  name_en: string
  relatedRegions: AthleteRegionId[]
  relevantModes: AthleteMode[]
  symptoms_th: string[]
  description_th: string
  // SAFETY: "อาจเกี่ยวข้องกับ" — NOT diagnosis
  disclaimer_th: string
  whenToSeekHelp_th: string
  screeningQuestions: AthleteQuestion[]
}

export interface AthleteQuestion {
  id: string
  question_th: string
  question_en: string
  type: 'select' | 'multiselect' | 'duration' | 'severity'
  options?: { value: string; label_th: string; label_en: string }[]
}

export interface AthleteBodyRegion {
  id: AthleteRegionId
  name_th: string
  name_en: string
  relatedConditions: string[]   // AthleteCondition ids
  relevantModes: AthleteMode[]
  causingActivities_th: string[]
  causingMovements_th: string[]
}
