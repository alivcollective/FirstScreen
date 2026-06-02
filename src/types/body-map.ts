// Body Map Type System — FirstScreen
// Supports: Phase 1 (2D), Phase 2 (regions), Phase 4 (3D future)
// SAFETY: Educational only. NOT diagnostic.

// ── View Modes ────────────────────────────────────────────────
// Phase 4: add '3d' here when Three.js integration is ready
export type BodyViewMode = 'front' | 'back'

// ── Urgency ───────────────────────────────────────────────────
export type UrgencyLevel = 'emergency' | 'urgent' | 'routine' | 'selfCare'

// ── Region Category ───────────────────────────────────────────
export type RegionCategory =
  | 'head'
  | 'neck'
  | 'torso'
  | 'shoulder'
  | 'arm'
  | 'hand'
  | 'hip'
  | 'leg'
  | 'foot'
  | 'back'
  | 'spine'

// ── Symptom ───────────────────────────────────────────────────
export interface BodySymptom {
  id: string
  label_th: string
  label_en: string
  urgency?: UrgencyLevel
  redFlagNote?: string   // shown if this symptom is selected
}

// ── Red Flag ──────────────────────────────────────────────────
export interface RedFlag {
  condition_th: string
  condition_en: string
  warning_th: string
  warning_en: string
  hotline?: string    // e.g. "1669"
}

// ── Screening Question ────────────────────────────────────────
export interface ScreeningQuestion {
  id: string
  question_th: string
  question_en: string
  type: 'boolean' | 'select' | 'duration' | 'severity'
  options?: { value: string; label_th: string; label_en: string }[]
}

// ── Body Region ───────────────────────────────────────────────
export interface BodyRegion {
  id: string
  slug: string                  // used in URL params
  name_th: string
  name_en: string
  viewMode: BodyViewMode[]      // which views show this region
  category: RegionCategory
  symptoms: BodySymptom[]
  possibleConditions: string[]  // "อาจเกี่ยวข้องกับ" — NOT diagnosis
  redFlags: RedFlag[]
  screeningQuestions: ScreeningQuestion[]
  nextRoute?: string            // e.g. '/risk#cvd' for heart region
  // SVG geometry — used by BodyViewer2D
  svgZone: {
    front?: string              // SVG path 'd' attr or element descriptor
    back?: string
  }
  svgLabel?: {                  // where to place the label in SVG coords
    front?: { x: number; y: number }
    back?: { x: number; y: number }
  }
}

// ── Selection State ───────────────────────────────────────────
export interface BodyMapSelection {
  regionId: string | null
  selectedSymptoms: string[]    // symptom ids
}

// ── Navigation Params ─────────────────────────────────────────
// Passed to /symptom-assessment via query params
export interface BodyMapNavParams {
  bodyPart: string              // region slug
  symptom?: string              // single or comma-separated
  viewMode?: BodyViewMode
}
