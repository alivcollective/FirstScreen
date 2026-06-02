/**
 * Clinical Database Query Helpers — FirstScreen
 * Type-safe wrappers for the clinical schema tables.
 *
 * All queries respect RLS policies.
 * SAFETY: All returned content is educational only.
 * Must be reviewed by physicians before clinical use.
 */

import { createClient as createBrowserClient } from './client'
import type {
  Symptom,
  Condition,
  SocialHistoryQuestion,
  RiskTool,
  ClinicalSession,
  SessionProfile,
  DifferentialResult,
  DifferentialComputeInput,
  BodyRegion,
  UrgencyLevel,
} from '@/types/clinical'

// ── Type Guards & Converters ──────────────────────────────────

function toSymptom(row: Record<string, unknown>): Symptom {
  return {
    id: row.id as string,
    code: row.code as string,
    name_th: row.name_th as string,
    name_en: row.name_en as string,
    body_region: row.body_region as BodyRegion,
    system: row.system as Symptom['system'],
    severity_weight: row.severity_weight as Symptom['severity_weight'],
    is_emergency: Boolean(row.is_emergency),
    follow_up_questions: (row.follow_up_questions as Symptom['follow_up_questions']) ?? [],
    created_at: row.created_at as string,
  }
}

function toCondition(row: Record<string, unknown>): Condition {
  return {
    id: row.id as string,
    icd11_code: row.icd11_code as string,
    name_th: row.name_th as string,
    name_en: row.name_en as string,
    category: row.category as Condition['category'],
    severity: row.severity as Condition['severity'],
    urgency_level: row.urgency_level as UrgencyLevel,
    prevalence_thailand: row.prevalence_thailand as string | undefined,
    specialty_required: row.specialty_required as string | undefined,
    encyclopedia_slug: row.encyclopedia_slug as string | undefined,
    created_at: row.created_at as string,
  }
}

// ── SYMPTOMS ──────────────────────────────────────────────────

/**
 * Fetch all symptoms for a body region, sorted by severity_weight desc.
 */
export async function getSymptomsByRegion(
  region: BodyRegion
): Promise<Symptom[]> {
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('symptoms')
    .select('*')
    .eq('body_region', region)
    .order('severity_weight', { ascending: false })
    .order('name_th')

  if (error || !data) {
    console.error('[clinical] getSymptomsByRegion error:', error?.message)
    return []
  }
  return (data as Record<string, unknown>[]).map(toSymptom)
}

/**
 * Fetch all emergency symptoms (is_emergency = true).
 * Used to pre-load the emergency detection set.
 */
export async function getEmergencySymptoms(): Promise<Symptom[]> {
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('symptoms')
    .select('id, code, name_th, name_en, body_region, system, severity_weight, is_emergency, follow_up_questions, created_at')
    .eq('is_emergency', true)

  if (error || !data) return []
  return (data as Record<string, unknown>[]).map(toSymptom)
}

/**
 * Fetch symptoms by IDs (for restoring saved sessions).
 */
export async function getSymptomsByIds(ids: string[]): Promise<Symptom[]> {
  if (!ids.length) return []
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('symptoms')
    .select('*')
    .in('id', ids)

  if (error || !data) return []
  return (data as Record<string, unknown>[]).map(toSymptom)
}

/**
 * Search symptoms by Thai or English name.
 */
export async function searchSymptoms(query: string): Promise<Symptom[]> {
  if (!query.trim()) return []
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('symptoms')
    .select('*')
    .or(`name_th.ilike.%${query}%,name_en.ilike.%${query}%`)
    .order('severity_weight', { ascending: false })
    .limit(20)

  if (error || !data) return []
  return (data as Record<string, unknown>[]).map(toSymptom)
}

// ── CONDITIONS ────────────────────────────────────────────────

/**
 * Fetch all conditions by category.
 */
export async function getConditionsByCategory(
  category: Condition['category']
): Promise<Condition[]> {
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('conditions')
    .select('*')
    .eq('category', category)
    .order('urgency_level', { ascending: false })

  if (error || !data) return []
  return (data as Record<string, unknown>[]).map(toCondition)
}

// ── DIFFERENTIAL DIAGNOSIS ────────────────────────────────────

/**
 * Compute differential diagnosis using the server-side PostgreSQL function.
 * Falls back to client-side calculation if Supabase is unavailable.
 */
export async function computeDifferentialDx(
  input: DifferentialComputeInput
): Promise<DifferentialResult[]> {
  const sb = createBrowserClient()

  const { symptom_inputs, profile } = input
  const symptomIds = symptom_inputs.map(s => s.symptom_id)

  if (!sb) {
    // Graceful fallback: return empty results
    console.warn('[clinical] Supabase unavailable — differential dx requires DB')
    return []
  }

  // Determine max severity from symptom inputs
  const maxSeverity = symptom_inputs.reduce(
    (m, s) => Math.max(m, s.severity ?? 5), 0
  )
  const hasSudden = symptom_inputs.some(s => s.sudden_onset)
  const hasWorsening = symptom_inputs.some(s => s.worsening)
  const minDuration = symptom_inputs.reduce(
    (m, s) => Math.min(m, s.duration_days ?? 999), 999
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb as any).rpc('compute_differential_dx', {
    p_symptom_ids:   symptomIds,
    p_age:           profile.age ?? null,
    p_sex:           profile.sex ?? null,
    p_pmh:           [
      profile.pmh?.diabetes ? 'diabetes' : null,
      profile.pmh?.hypertension ? 'hypertension' : null,
      profile.pmh?.hbv ? 'hbv' : null,
    ].filter(Boolean) as string[],
    p_pack_years:    profile.smoking?.pack_years ?? 0,
    p_quit_years:    profile.smoking?.quit_years_ago ?? null,
    p_audit_c_score: profile.alcohol?.audit_c_score ?? 0,
    p_has_diabetes:  profile.pmh?.diabetes ?? false,
    p_has_htn:       profile.pmh?.hypertension ?? false,
    p_has_hbv:       profile.pmh?.hbv ?? false,
    p_family_hx_cvd: profile.family_hx?.cvd ?? false,
    p_severity:      maxSeverity,
    p_duration_days: minDuration < 999 ? minDuration : 1,
    p_worsening:     hasWorsening,
  })

  if (error || !data) {
    console.error('[clinical] compute_differential_dx error:', error?.message)
    return []
  }

  return (data as Record<string, unknown>[]).map(row => ({
    condition: {
      id: row.condition_id as string,
      icd11_code: row.icd11_code as string,
      name_th: row.name_th as string,
      name_en: row.name_en as string,
      category: row.category as Condition['category'],
      severity: row.severity as Condition['severity'],
      urgency_level: row.urgency_level as UrgencyLevel,
      specialty_required: row.specialty_required as string | undefined,
      encyclopedia_slug: row.encyclopedia_slug as string | undefined,
      created_at: '',
    },
    score: Math.round((row.total_score as number) * 100),
    confidence: row.confidence as DifferentialResult['confidence'],
    matched_symptoms: symptomIds,
    key_modifiers: [],
  }))
}

/**
 * Determine urgency level from selected symptoms and session data.
 * Emergency is triggered if:
 * 1. Any symptom has is_emergency=true
 * 2. Severity ≥ 9
 * 3. Multiple critical symptoms in dangerous combination
 */
export function determineUrgencyLevel(
  symptoms: Symptom[],
  severity: number,
  differentialResults: DifferentialResult[]
): UrgencyLevel {
  // Emergency — any critical symptom or severity ≥9
  const hasEmergency = symptoms.some(s => s.is_emergency)
  if (hasEmergency || severity >= 9) return 4

  // Check if top condition is emergency
  const topCondition = differentialResults[0]?.condition
  if (topCondition?.urgency_level === 4) return 4

  // High severity symptoms
  const hasHighSeverity = symptoms.some(s => s.severity_weight >= 3)
  if (hasHighSeverity && severity >= 7) return 3
  if (topCondition?.urgency_level === 3) return 3

  // Moderate
  if (symptoms.some(s => s.severity_weight >= 2)) return 2
  if (topCondition?.urgency_level === 2) return 2

  return 1
}

// ── SOCIAL HISTORY QUESTIONS ──────────────────────────────────

/**
 * Fetch all social history questions for a category.
 */
export async function getSocialHistoryQuestions(
  category: string
): Promise<SocialHistoryQuestion[]> {
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('social_history_questions')
    .select('*')
    .eq('category', category)
    .order('display_order')

  if (error || !data) return []
  return data as SocialHistoryQuestion[]
}

/**
 * Fetch all social history questions across all categories.
 */
export async function getAllSocialHistoryQuestions(): Promise<
  Record<string, SocialHistoryQuestion[]>
> {
  const sb = createBrowserClient()
  if (!sb) return {}

  const { data, error } = await sb
    .from('social_history_questions')
    .select('*')
    .order('category')
    .order('display_order')

  if (error || !data) return {}

  const grouped: Record<string, SocialHistoryQuestion[]> = {}
  for (const q of data as SocialHistoryQuestion[]) {
    if (!grouped[q.category]) grouped[q.category] = []
    grouped[q.category].push(q)
  }
  return grouped
}

// ── RISK TOOLS ────────────────────────────────────────────────

/**
 * Fetch a risk tool by key (e.g. 'phq9', 'gad7', 'audit_c').
 */
export async function getRiskTool(toolKey: string): Promise<RiskTool | null> {
  const sb = createBrowserClient()
  if (!sb) return null

  const { data, error } = await sb
    .from('risk_tools')
    .select('*')
    .eq('tool_key', toolKey)
    .eq('active', true)
    .single()

  if (error || !data) return null
  return data as RiskTool
}

/**
 * Fetch all active risk tools.
 */
export async function getAllRiskTools(): Promise<RiskTool[]> {
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('risk_tools')
    .select('*')
    .eq('active', true)
    .order('name_th')

  if (error || !data) return []
  return data as RiskTool[]
}

// ── CLINICAL SESSIONS ─────────────────────────────────────────

/**
 * Create or update a clinical session.
 * Returns the session token for later retrieval.
 */
export async function upsertClinicalSession(
  session: Partial<ClinicalSession> & { session_token: string }
): Promise<string | null> {
  const sb = createBrowserClient()
  if (!sb) {
    // Static mode: return token without persisting
    if (process.env.NODE_ENV === 'development') {
      console.debug('[clinical] Static mode — session not persisted')
    }
    return session.session_token
  }

  // Flatten to DB column names
  const row: Record<string, unknown> = {
    session_token: session.session_token,
    age: session.age,
    sex: session.sex,
    chief_complaint: session.chief_complaint,
    symptom_ids: session.symptom_ids,
    social_history: session.social_history,
    pmh_conditions: session.pmh_conditions,
    pmh_allergies: session.pmh_allergies,
    current_medications: session.current_medications,
    family_hx: session.family_hx,
    differential_results: session.differential_results,
    urgency_level: session.urgency_level,
    recommended_actions: session.recommended_actions,
    risk_results: session.risk_results,
  }

  // OLDCARTS fields
  if (session.oldcarts) {
    const o = session.oldcarts
    row.onset_date = o.onset_date
    row.onset_description = o.onset_description
    row.location = o.location
    row.duration_days = o.duration_days
    row.character_description = o.character_description
    row.aggravating_factors = o.aggravating_factors
    row.relieving_factors = o.relieving_factors
    row.timing = o.timing
    row.severity_score = o.severity_score
    row.associated_symptoms = o.associated_symptoms
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb as any)
    .from('clinical_sessions')
    .upsert(row, { onConflict: 'session_token' })

  if (error) {
    console.error('[clinical] upsertSession error:', error.message)
    return null
  }
  return session.session_token
}

/**
 * Mark a session as completed.
 */
export async function completeSession(sessionToken: string): Promise<void> {
  const sb = createBrowserClient()
  if (!sb) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb as any)
    .from('clinical_sessions')
    .update({ completed_at: new Date().toISOString() })
    .eq('session_token', sessionToken)
}

/**
 * Retrieve a session by token.
 * Returns null if not found or Supabase unavailable.
 */
export async function getSession(
  sessionToken: string
): Promise<ClinicalSession | null> {
  const sb = createBrowserClient()
  if (!sb) return null

  const { data, error } = await sb
    .from('clinical_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single()

  if (error || !data) return null

  const row = data as Record<string, unknown>
  return {
    id: row.id as string,
    session_token: row.session_token as string,
    age: row.age as number | undefined,
    sex: row.sex as ClinicalSession['sex'],
    chief_complaint: row.chief_complaint as string | undefined,
    symptom_ids: row.symptom_ids as string[] | undefined,
    social_history: row.social_history as ClinicalSession['social_history'],
    pmh_conditions: row.pmh_conditions as string[] | undefined,
    pmh_allergies: row.pmh_allergies as string[] | undefined,
    current_medications: row.current_medications as string[] | undefined,
    family_hx: row.family_hx as ClinicalSession['family_hx'],
    differential_results: row.differential_results as DifferentialResult[] | undefined,
    urgency_level: row.urgency_level as UrgencyLevel | undefined,
    recommended_actions: row.recommended_actions as string[] | undefined,
    risk_results: row.risk_results as ClinicalSession['risk_results'],
    created_at: row.created_at as string,
    completed_at: row.completed_at as string | undefined,
    oldcarts: {
      onset_date: row.onset_date as string | undefined,
      onset_description: row.onset_description as string | undefined,
      location: row.location as string | undefined,
      duration_days: row.duration_days as number | undefined,
      character_description: row.character_description as string | undefined,
      aggravating_factors: row.aggravating_factors as string[] | undefined,
      relieving_factors: row.relieving_factors as string[] | undefined,
      timing: row.timing as string | undefined,
      severity_score: row.severity_score as number | undefined,
      associated_symptoms: row.associated_symptoms as string[] | undefined,
    },
  }
}

// ── ANALYTICS (aggregate only, no PII) ───────────────────────

/**
 * Get urgency level distribution for population analytics.
 * Returns aggregate counts — no individual data.
 */
export async function getUrgencyDistribution(): Promise<
  Array<{ urgency_level: number; count: number }>
> {
  const sb = createBrowserClient()
  if (!sb) return []

  const { data, error } = await sb
    .from('clinical_sessions')
    .select('urgency_level')
    .not('urgency_level', 'is', null)
    .not('completed_at', 'is', null)

  if (error || !data) return []

  const counts: Record<number, number> = {}
  for (const row of data as { urgency_level: number }[]) {
    counts[row.urgency_level] = (counts[row.urgency_level] ?? 0) + 1
  }
  return Object.entries(counts).map(([level, count]) => ({
    urgency_level: parseInt(level),
    count,
  }))
}
