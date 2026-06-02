import { createClient } from '@supabase/supabase-js'
import type { Symptom, BodyRegion, Condition, ClinicalPathway } from '@/types/medical'

export interface SymptomFormData {
  code: string
  name_th: string
  name_en: string
  body_region: string
  system: string
  severity_weight: 1 | 2 | 3 | 4
  is_emergency: boolean
  follow_up_questions: unknown[]
  description_th: string
  aliases: string[]
  tags: string[]
  slug: string
}

export interface SymptomListOptions {
  status?: string
  body_region?: string
  system?: string
  search?: string
  limit?: number
  offset?: number
}

export interface SymptomWithRelations extends Symptom {
  body_regions?: BodyRegion[]
  conditions?: Condition[]
  pathways?: ClinicalPathway[]
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// ── List symptoms ─────────────────────────────────────────────

export async function getSymptoms(
  opts: SymptomListOptions = {}
): Promise<{ data: Symptom[]; count: number }> {
  const { status, body_region, system, search, limit = 50, offset = 0 } = opts
  const sb = getClient()

  try {
    let query = sb
      .from('symptoms')
      .select('*', { count: 'exact' })
      .order('name_th', { ascending: true })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (body_region) query = query.eq('body_region', body_region)
    if (system) query = query.eq('system', system)
    if (search) {
      query = query.or(
        `name_th.ilike.%${search}%,name_en.ilike.%${search}%,code.ilike.%${search}%`
      )
    }

    const { data, count, error } = await query
    if (error) throw error
    return { data: (data ?? []) as Symptom[], count: count ?? 0 }
  } catch (err) {
    console.error('[getSymptoms]', err)
    return { data: [], count: 0 }
  }
}

// ── Get symptom by ID with relations ─────────────────────────

export async function getSymptomById(id: string): Promise<SymptomWithRelations | null> {
  const sb = getClient()

  try {
    const { data: symptom, error } = await sb
      .from('symptoms')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !symptom) return null

    const [regionsRes, conditionsRes] = await Promise.all([
      sb
        .from('region_symptoms')
        .select('region:body_regions(*)')
        .eq('symptom_id', id),
      sb
        .from('condition_symptoms')
        .select('condition:conditions(*)')
        .eq('symptom_id', id),
    ])

    return {
      ...(symptom as Symptom),
      body_regions: (regionsRes.data ?? []).map(
        (r: Record<string, unknown>) => r.region as BodyRegion
      ),
      conditions: (conditionsRes.data ?? []).map(
        (r: Record<string, unknown>) => r.condition as Condition
      ),
    }
  } catch (err) {
    console.error('[getSymptomById]', err)
    return null
  }
}

// ── Create symptom ────────────────────────────────────────────

export async function createSymptom(data: SymptomFormData): Promise<Symptom> {
  const sb = getClient()

  const slug =
    data.slug ||
    data.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) ||
    `symptom-${Date.now()}`

  const payload = {
    slug,
    code: data.code || `DRAFT-${Date.now()}`,
    name_th: data.name_th,
    name_en: data.name_en || data.name_th,
    body_region: data.body_region || 'general',
    system: data.system || 'general',
    severity_weight: data.severity_weight ?? 1,
    is_emergency: data.is_emergency ?? false,
    follow_up_questions: data.follow_up_questions ?? [],
    description_th: data.description_th || null,
    aliases: data.aliases ?? [],
    tags: data.tags ?? [],
    status: 'draft',
  }

  const { data: created, error } = await sb.from('symptoms').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return created as Symptom
}

// ── Update symptom ────────────────────────────────────────────

export async function updateSymptom(
  id: string,
  updates: Partial<SymptomFormData>
): Promise<Symptom> {
  const sb = getClient()

  const { data, error } = await sb
    .from('symptoms')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Symptom
}

// ── Link symptom → body regions ───────────────────────────────

export async function linkSymptomRegions(
  symptomId: string,
  regionIds: string[]
): Promise<void> {
  const sb = getClient()

  await sb.from('region_symptoms').delete().eq('symptom_id', symptomId)

  if (regionIds.length === 0) return

  const rows = regionIds.map((region_id) => ({ region_id, symptom_id: symptomId }))
  const { error } = await sb.from('region_symptoms').insert(rows)
  if (error) throw new Error(error.message)
}

// ── Completeness calculator (local, no API) ───────────────────

export function calcSymptomCompleteness(data: Partial<SymptomFormData>): number {
  const checks: Array<[() => boolean, number]> = [
    [() => !!data.name_th?.trim(), 20],
    [() => !!data.name_en?.trim(), 10],
    [() => !!data.code?.trim(), 10],
    [() => !!data.body_region, 10],
    [() => !!data.system, 10],
    [() => !!data.description_th?.trim(), 15],
    [() => Array.isArray(data.follow_up_questions) && data.follow_up_questions.length > 0, 15],
    [() => !!data.severity_weight && data.severity_weight >= 1, 5],
    [() => Array.isArray(data.aliases) && data.aliases.length > 0, 5],
  ]
  return checks.reduce((sum, [check, weight]) => sum + (check() ? weight : 0), 0)
}
