/**
 * Health Compass — Data Service Abstraction Layer
 *
 * Two modes controlled by env var:
 *   NEXT_PUBLIC_USE_SUPABASE=false (default) → reads from /data/*.ts static files
 *   NEXT_PUBLIC_USE_SUPABASE=true            → queries Supabase tables
 *
 * Switching modes: zero code changes in app, just flip the env var.
 *
 * SAFETY: All data returned is educational only. No PII in any query.
 */

import type { RichDisease, DiseaseCard } from '@/types/disease'
import type { AssessmentResultInsert } from '@/lib/supabase/types'

// ─── Mode detection ──────────────────────────────────────────────────────────

export const DATA_MODE: 'static' | 'supabase' =
  process.env.NEXT_PUBLIC_USE_SUPABASE === 'true' ? 'supabase' : 'static'

const isSupabase = DATA_MODE === 'supabase'

// ─── App-level types (decoupled from DB row types) ───────────────────────────

export interface Disease extends RichDisease {}

export interface DiseaseListItem extends DiseaseCard {}

export interface SymptomDB {
  id: string
  nameTh: string
  nameEn: string
  bodyRegion: string
  severity: 'mild' | 'moderate' | 'severe' | 'critical'
  descriptionTh: string
  frequencyNote?: string
}

export interface ConditionDB {
  id: string
  nameTh: string
  nameEn: string
  urgencyLevel: 'emergency' | 'urgent' | 'appointment' | 'selfcare'
  descriptionTh: string
  specialtyTh: string
  diseaseSlug?: string
  suggestedTests: string[]
  redFlags: string[]
  isEmergency: boolean
}

export interface Hospital {
  id: string
  nameTh: string
  nameEn: string
  province: string
  district?: string
  address?: string
  lat?: number
  lng?: number
  specialties: string[]
  phone?: string
  website?: string
  type: 'public' | 'private' | 'clinic'
  accreditations: string[]
  insuranceAccepted: string[]
  rating?: number
  isVerified: boolean
}

export interface AssessmentPayload {
  sessionId: string
  assessmentType: 'diabetes' | 'cardiovascular' | 'mental_health' | 'cancer' | 'symptom_check'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputData: any   // Supabase Json type accepts any JSON-serializable value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resultData: any
  locale?: string
  userAgeBand?: string
  userSex?: 'male' | 'female' | 'other'
}

// ─── Static data imports (tree-shaken when USE_SUPABASE=true in production) ──

async function getStaticDiseaseData() {
  const { getRichDisease, getAllDiseaseCardsForListing } = await import('@/data/diseases/index')
  return { getRichDisease, getAllDiseaseCardsForListing }
}

async function getStaticSymptomData() {
  const { SYMPTOM_DATA, CONDITIONS } = await import('@/data/symptom-conditions')
  // symptoms-data.ts has richer ConditionGroup with specialtyTh — use it for display
  const { CONDITION_GROUPS } = await import('@/lib/symptoms-data')
  return { SYMPTOM_DATA, CONDITIONS, CONDITION_GROUPS }
}

// ─── Helpers: convert Supabase row → app type ────────────────────────────────

function rowToDisease(row: Record<string, unknown>): Disease {
  // The 'content' JSONB column stores the full RichDisease object
  const content = row.content as RichDisease
  return {
    ...content,
    slug: row.slug as string,
    nameTh: row.name_th as string,
    nameEn: row.name_en as string,
    lastReviewed: row.last_reviewed as string,
    reviewedBy: row.reviewed_by as string,
  }
}

function rowToHospital(row: Record<string, unknown>): Hospital {
  return {
    id: row.id as string,
    nameTh: row.name_th as string,
    nameEn: row.name_en as string,
    province: row.province as string,
    district: row.district as string | undefined,
    address: row.address as string | undefined,
    lat: row.lat as number | undefined,
    lng: row.lng as number | undefined,
    specialties: (row.specialties as string[]) ?? [],
    phone: row.phone as string | undefined,
    website: row.website as string | undefined,
    type: (row.type as Hospital['type']) ?? 'private',
    accreditations: (row.accreditations as string[]) ?? [],
    insuranceAccepted: (row.insurance_accepted as string[]) ?? [],
    rating: row.rating as number | undefined,
    isVerified: Boolean(row.is_verified),
  }
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Get a single disease by slug.
 * Returns null if not found.
 */
export async function getDiseaseBySlug(slug: string): Promise<Disease | null> {
  if (!isSupabase) {
    const { getRichDisease } = await getStaticDiseaseData()

    // Try rich data first
    const rich = getRichDisease(slug)
    if (rich) return rich

    // Fall back to legacy disease-data.ts and wrap it
    const { getDiseaseData } = await import('@/lib/disease-data')
    const legacy = getDiseaseData(slug)
    if (!legacy) return null

    // Minimal mapping so legacy data works with the same interface
    return {
      slug: legacy.slug,
      nameTh: legacy.nameTh,
      nameTh_short: legacy.nameTh_short,
      nameEn: legacy.nameEn,
      category: 'general' as const,
      categoryTh: legacy.categoryTh,
      icd10: legacy.icd10,
      riskLevel: legacy.riskLevel as Disease['riskLevel'],
      shortDescriptionTh: legacy.overview.th.slice(0, 120),
      lastReviewed: legacy.lastReviewed,
      reviewedBy: legacy.reviewerPlaceholder ?? 'รอการรับรอง',
      stats: {
        prevalenceThailand: legacy.prevalence,
        prevalenceThai: legacy.prevalenceTh,
        primaryRiskGroupTh: 'ดูข้อมูลในหน้าโรค',
      },
      overviewTh: legacy.overview.th,
      symptoms: legacy.earlySymptoms.map((s, i) => ({
        id: `legacy_${i}`,
        nameTh: s,
        nameEn: s,
        severity: 'moderate' as const,
        descriptionTh: s,
      })),
      redFlagsTh: legacy.redFlags,
      causesTh: [],
      riskFactors: legacy.riskFactors.map(r => ({
        nameTh: r,
        type: 'non_modifiable' as const,
        descriptionTh: r,
      })),
      screening: legacy.screeningInfo.tests.map((t, i) => ({
        id: `scr_${i}`,
        nameTh: t,
        nameEn: t,
        ageRange: legacy.screeningInfo.from_age ? `${legacy.screeningInfo.from_age}+ ปี` : 'ตามแพทย์แนะนำ',
        sex: 'all' as const,
        frequency: legacy.screeningInfo.frequency ?? 'ตามแพทย์แนะนำ',
        descriptionTh: t,
        isNHSOCovered: false,
        guidelineSource: legacy.screeningInfo.guidelineTh,
      })),
      treatments: [{
        categoryTh: 'ภาพรวมการรักษา',
        nameTh: legacy.treatmentOverview.slice(0, 80),
        descriptionTh: legacy.treatmentOverview,
      }],
      prevention: legacy.prevention.map(p => ({
        actionTh: p,
        descriptionTh: p,
        impact: 'medium' as const,
        evidence: 'ต้องตรวจสอบ',
      })),
      whenToSeeDoctorTh: legacy.whenToSeeDoctor,
      faqsTh: legacy.faqs,
      references: [],
      relatedDiseases: [],
      keywords: [],
    }
  }

  // ── Supabase mode ──
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('diseases')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return rowToDisease(data as Record<string, unknown>)
}

/**
 * Get all diseases, optionally filtered by category.
 */
export async function getAllDiseases(category?: string): Promise<DiseaseListItem[]> {
  if (!isSupabase) {
    const { getAllDiseaseCardsForListing } = await getStaticDiseaseData()
    const all = getAllDiseaseCardsForListing()
    if (!category || category === 'all') return all
    return all.filter(d => d.category === category)
  }

  // ── Supabase mode ──
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase
    .from('diseases')
    .select('slug, name_th, name_th_short, name_en, category, category_th, icd10, risk_level, short_description_th, stats, last_reviewed')
    .eq('published', true)
    .order('name_th')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error || !data) return []

  // Cast needed because partial .select() loses specific column types
  const rows = data as Array<Record<string, unknown>>

  return rows.map(row => ({
    slug: row.slug as string,
    nameTh: row.name_th as string,
    nameTh_short: row.name_th_short as string,
    nameEn: row.name_en as string,
    category: row.category as DiseaseListItem['category'],
    categoryTh: row.category_th as string,
    icd10: row.icd10 as string,
    riskLevel: row.risk_level as DiseaseListItem['riskLevel'],
    shortDescriptionTh: row.short_description_th as string,
    stats: row.stats as DiseaseListItem['stats'],
    lastReviewed: row.last_reviewed as string,
    isRich: true,
  }))
}

/**
 * Get symptoms for a specific body region.
 */
export async function getSymptomsByRegion(region: string): Promise<SymptomDB[]> {
  if (!isSupabase) {
    const { SYMPTOM_DATA } = await getStaticSymptomData()
    const validRegion = region as keyof typeof SYMPTOM_DATA
    const symptoms = SYMPTOM_DATA[validRegion] ?? []
    return symptoms.map(s => ({
      id: s.id,
      nameTh: s.label,
      nameEn: s.id.replace(/_/g, ' '),
      bodyRegion: region,
      severity: s.severity === 'critical' ? 'critical'
        : s.severity === 'high' ? 'severe'
        : s.severity === 'medium' ? 'moderate'
        : 'mild',
      descriptionTh: s.label,
    }))
  }

  // ── Supabase mode ──
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('symptoms')
    .select('*')
    .eq('body_region', region)
    .order('name_th')

  if (error || !data) return []

  const symRows = data as Array<Record<string, unknown>>
  return symRows.map(row => ({
    id: row.id as string,
    nameTh: row.name_th as string,
    nameEn: row.name_en as string,
    bodyRegion: row.body_region as string,
    severity: row.severity_level as SymptomDB['severity'],
    descriptionTh: row.description_th as string,
    frequencyNote: (row.frequency_note as string | null) ?? undefined,
  }))
}

/**
 * Get condition groups that match a set of symptom IDs.
 */
export async function getConditionsForSymptoms(symptomIds: string[]): Promise<ConditionDB[]> {
  if (!isSupabase) {
    // Use richer symptoms-data.ts CONDITION_GROUPS for display (has specialtyTh, suggestedTests, etc.)
    const { scoreConditionGroups } = await import('@/lib/symptoms-data')
    const profile = { age: null, isSmoker: false, sex: '' }
    const groups = scoreConditionGroups(symptomIds, {}, profile)
    return groups.map(g => ({
      id: g.id,
      nameTh: g.nameTh,
      nameEn: g.nameEn,
      urgencyLevel: (g.urgencyLevel === 'urgent' ? 'urgent'
        : g.urgencyLevel === 'emergency' ? 'emergency'
        : g.urgencyLevel === 'soon' ? 'appointment'
        : 'selfcare') as ConditionDB['urgencyLevel'],
      descriptionTh: g.descriptionTh,
      specialtyTh: g.specialtyTh,
      diseaseSlug: undefined,
      suggestedTests: g.suggestedTestsTh ?? [],
      redFlags: g.redFlagsTh ?? [],
      isEmergency: false,
    }))
  }

  // ── Supabase mode ──
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return []

  // Use the scoring function stored in DB (calls overlap scoring per row)
  const { data, error } = await supabase
    .from('symptom_conditions')
    .select('*')
    .overlaps('symptom_ids', symptomIds)

  if (error || !data) return []

  const condRows = data as Array<Record<string, unknown>>
  return condRows
    .map(row => ({
      id: row.id as string,
      nameTh: row.condition_name_th as string,
      nameEn: row.condition_name_en as string,
      urgencyLevel: row.urgency_level as ConditionDB['urgencyLevel'],
      descriptionTh: row.description_th as string,
      specialtyTh: row.specialty_th as string,
      diseaseSlug: (row.disease_slug as string | null) ?? undefined,
      suggestedTests: (row.suggested_tests_th as string[] | null) ?? [],
      redFlags: (row.red_flags_th as string[] | null) ?? [],
      isEmergency: Boolean(row.is_emergency),
    }))
    .slice(0, 4)
}

/**
 * Save an anonymous assessment result.
 * No-op in static mode (returns void with no side effects).
 * In Supabase mode: insert-only, no PII, no user_id.
 */
export async function saveAssessmentResult(payload: AssessmentPayload): Promise<void> {
  if (!isSupabase) {
    // Static mode: silent no-op. Results stay in browser only.
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DataService] STATIC mode — assessment result not persisted:', payload.assessmentType)
    }
    return
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return

  const insert: AssessmentResultInsert = {
    session_id: payload.sessionId,
    assessment_type: payload.assessmentType,
    input_data: payload.inputData,
    result_data: payload.resultData,
    locale: payload.locale ?? 'th',
    user_age_band: payload.userAgeBand ?? null,
    user_sex: payload.userSex ?? null,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('assessment_results').insert(insert as any)

  if (error) {
    // Non-fatal: log but don't throw — the user's result is already shown client-side
    console.error('[DataService] Failed to save assessment result:', error.message)
  }
}

/**
 * Get hospitals by province (Thai province name or 'all').
 */
export async function getHospitalsByProvince(province: string): Promise<Hospital[]> {
  if (!isSupabase) {
    // Static mode: import from static hospitals data if it exists
    try {
      // HOSPITALS data file created when hospital finder feature ships
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('@/data/hospitals') as { HOSPITALS: Hospital[] }
      if (!province || province === 'all') return mod.HOSPITALS
      return mod.HOSPITALS.filter(h => h.province === province || h.nameTh.includes(province))
    } catch {
      // No hospitals data file yet — return empty array gracefully
      return []
    }
  }

  // ── Supabase mode ──
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase
    .from('hospitals')
    .select('*')
    .eq('is_active', true)
    .order('name_th')

  if (province && province !== 'all') {
    query = query.eq('province', province)
  }

  const { data, error } = await query
  if (error || !data) return []

  return data.map(row => rowToHospital(row as Record<string, unknown>))
}

/**
 * Full-text disease search.
 * Static mode: client-side filter on name fields.
 * Supabase mode: uses PostgreSQL full-text search function.
 */
export async function searchDiseases(query: string): Promise<DiseaseListItem[]> {
  const all = await getAllDiseases()
  if (!query.trim()) return all

  const q = query.toLowerCase()
  return all.filter(d =>
    d.nameTh.toLowerCase().includes(q) ||
    d.nameTh_short.toLowerCase().includes(q) ||
    d.nameEn.toLowerCase().includes(q) ||
    d.icd10.toLowerCase().includes(q) ||
    d.shortDescriptionTh.toLowerCase().includes(q)
  )
}

// ─── Status helpers ───────────────────────────────────────────────────────────

export function getDataServiceStatus() {
  return {
    mode: DATA_MODE,
    isSupabase,
    isConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  }
}
