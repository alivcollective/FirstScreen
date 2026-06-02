import { createClient } from '@supabase/supabase-js'
import type {
  Condition,
  ConditionFormData,
  ConditionListOptions,
  PaginatedConditions,
  ContentStatus,
  AIUsageStatus,
  ConditionSymptom,
} from '@/types/medical'

const DAILY_AI_LIMIT = 10

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// ── List conditions ───────────────────────────────────────────

export async function getConditions(opts: ConditionListOptions = {}): Promise<PaginatedConditions> {
  const { status, specialty, search, page = 1, pageSize = 50 } = opts
  const sb = getClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    let query = sb
      .from('conditions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status) query = query.eq('status', status)
    if (specialty) query = query.eq('specialty_required', specialty)
    if (search) {
      query = query.or(`name_th.ilike.%${search}%,name_en.ilike.%${search}%,icd11_code.ilike.%${search}%`)
    }

    const { data, count, error } = await query
    if (error) throw error

    return {
      data: (data ?? []) as Condition[],
      total: count ?? 0,
      page,
      pageSize,
    }
  } catch (err) {
    console.error('[getConditions]', err)
    return { data: [], total: 0, page, pageSize }
  }
}

// ── Get condition by ID with joined data ──────────────────────

export async function getConditionById(id: string): Promise<Condition | null> {
  const sb = getClient()

  try {
    const { data: condition, error } = await sb
      .from('conditions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !condition) return null

    const [symptomsRes, refsRes, regionsRes] = await Promise.all([
      sb
        .from('condition_symptoms')
        .select('*, symptom:symptoms(*)')
        .eq('condition_id', id),
      sb
        .from('entity_references')
        .select('reference:medical_references(*)')
        .eq('entity_type', 'condition')
        .eq('entity_id', id),
      sb
        .from('region_conditions')
        .select('region:body_regions(*)')
        .eq('condition_id', id),
    ])

    return {
      ...(condition as Condition),
      symptoms: (symptomsRes.data ?? []) as ConditionSymptom[],
      references: (refsRes.data ?? []).map(
        (r: Record<string, unknown>) => r.reference as import('@/types/medical').MedicalReference
      ),
      regions: (regionsRes.data ?? []).map(
        (r: Record<string, unknown>) => r.region as import('@/types/medical').BodyRegion
      ),
    }
  } catch (err) {
    console.error('[getConditionById]', err)
    return null
  }
}

// ── Create condition ──────────────────────────────────────────

export async function createCondition(formData: ConditionFormData): Promise<Condition> {
  const sb = getClient()

  const slug = formData.name_en
    ? formData.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
    : `condition-${Date.now()}`

  const payload = {
    slug,
    name_th: formData.name_th,
    name_en: formData.name_en?.trim() || formData.name_th,
    icd11_code: formData.icd11_code || `DRAFT-${Date.now()}`,
    category: formData.category || 'other',
    severity: formData.severity || 'moderate',
    urgency_level: formData.urgency_level ?? 1,
    specialty_required: formData.specialty || null,
    description_th: formData.description_th || null,
    aliases: formData.aliases,
    tags: formData.tags,
    age_group: formData.age_group || null,
    sex_predominant: formData.sex_predominant || null,
    evidence_level: formData.evidence_level || null,
    reviewer_name: formData.reviewer_name || null,
    disclaimer_th: formData.disclaimer_th || null,
    status: 'draft' as ContentStatus,
  }

  const { data, error } = await sb.from('conditions').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data as Condition
}

// ── Update condition ──────────────────────────────────────────

export async function updateCondition(
  id: string,
  updates: Partial<ConditionFormData>
): Promise<Condition> {
  const sb = getClient()

  const { data, error } = await sb
    .from('conditions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Condition
}

// ── Update condition status (with review metadata) ────────────

export async function updateConditionStatus(
  id: string,
  status: ContentStatus,
  reviewer?: string
): Promise<Condition> {
  const sb = getClient()
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setMonth(expiresAt.getMonth() + 24)

  const updates: Record<string, unknown> = {
    status,
    updated_at: now.toISOString(),
  }

  if (status === 'approved' || status === 'published') {
    updates.reviewed_at = now.toISOString()
    updates.expires_at = expiresAt.toISOString()
    if (reviewer) updates.reviewer_name = reviewer
  }

  const { data, error } = await sb
    .from('conditions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Condition
}

// ── Link condition → symptoms ─────────────────────────────────

export async function linkConditionSymptoms(
  conditionId: string,
  symptoms: Array<{ symptom_id: string; is_primary?: boolean; frequency?: string }>
): Promise<void> {
  const sb = getClient()

  await sb.from('condition_symptoms').delete().eq('condition_id', conditionId)

  if (symptoms.length === 0) return

  const rows = symptoms.map((s) => ({
    condition_id: conditionId,
    symptom_id: s.symptom_id,
    is_primary: s.is_primary ?? false,
    frequency: s.frequency ?? null,
  }))

  const { error } = await sb.from('condition_symptoms').insert(rows)
  if (error) throw new Error(error.message)
}

// ── AI usage ──────────────────────────────────────────────────

export async function getAIUsageStatus(userId: string): Promise<AIUsageStatus> {
  const sb = getClient()

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { count, error } = await sb
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())

    if (error) throw error

    const used = count ?? 0
    return {
      used,
      limit: DAILY_AI_LIMIT,
      remaining: Math.max(0, DAILY_AI_LIMIT - used),
      resets_at: tomorrow.toISOString(),
    }
  } catch (err) {
    console.error('[getAIUsageStatus]', err)
    return { used: 0, limit: DAILY_AI_LIMIT, remaining: DAILY_AI_LIMIT, resets_at: '' }
  }
}

export async function trackAIUsage(
  userId: string,
  actionType: string,
  tokensUsed?: number
): Promise<void> {
  const sb = getClient()

  try {
    await sb.from('ai_usage').insert({
      user_id: userId,
      action_type: actionType,
      tokens_used: tokensUsed ?? 0,
    })
  } catch (err) {
    console.error('[trackAIUsage]', err)
  }
}

// ── Completeness calculator (local, no API) ───────────────────

const COMPLETENESS_WEIGHTS: Array<[keyof ConditionFormData, number]> = [
  ['name_th', 25],
  ['name_en', 10],
  ['icd11_code', 10],
  ['description_th', 20],
  ['severity', 10],
  ['urgency_level', 5],
  ['age_group', 5],
  ['evidence_level', 10],
  ['reviewer_name', 5],
]

export function calcCompleteness(data: Partial<ConditionFormData>): number {
  let score = 0
  for (const [field, weight] of COMPLETENESS_WEIGHTS) {
    const val = data[field]
    if (val === null || val === undefined || val === '') continue
    if (Array.isArray(val) && val.length === 0) continue
    score += weight
  }
  return Math.min(100, score)
}
