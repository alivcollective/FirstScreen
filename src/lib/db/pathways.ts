import { createClient } from '@supabase/supabase-js'
import type {
  ClinicalPathway, PathwayFormData, ContentStatus,
  Symptom, BodyRegion, Condition, MedicalReference,
} from '@/types/medical'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// ── Slug helper ───────────────────────────────────────────────

function toSlug(text: string): string {
  const ascii = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return ascii.length > 4 ? ascii.slice(0, 80) : `pathway-${Date.now()}`
}

// ── DB row → ClinicalPathway (handles column renames) ─────────

function mapRow(row: Record<string, unknown>): ClinicalPathway {
  return {
    ...(row as unknown as ClinicalPathway),
    red_flags: (row.red_flags_jsonb ?? row.red_flags ?? []) as ClinicalPathway['red_flags'],
    recommendations: (row.recommendations_jsonb ?? row.recommendations ?? []) as ClinicalPathway['recommendations'],
    screening_questions: (row.screening_questions ?? []) as ClinicalPathway['screening_questions'],
    tags: (row.tags ?? []) as string[],
    aliases: (row.aliases ?? []) as string[],
  }
}

// ── List pathways ─────────────────────────────────────────────

export async function getPathways(opts: {
  status?: string
  specialty?: string
  search?: string
  limit?: number
  offset?: number
} = {}): Promise<{ data: ClinicalPathway[]; count: number }> {
  const { status, specialty, search, limit = 20, offset = 0 } = opts
  const sb = getClient()

  try {
    let query = sb
      .from('clinical_pathways')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (specialty) query = query.eq('specialty', specialty)
    if (search) query = query.ilike('name_th', `%${search}%`)

    const { data, count, error } = await query
    if (error) throw error

    // Enrich with relation counts for card display
    const enriched = await Promise.all((data ?? []).map(async (p: Record<string, unknown>) => {
      const [regRes, symRes, condRes] = await Promise.all([
        sb.from('pathway_body_regions').select('id', { count: 'exact', head: true }).eq('pathway_id', p.id),
        sb.from('pathway_symptoms').select('id', { count: 'exact', head: true }).eq('pathway_id', p.id),
        sb.from('pathway_conditions').select('id', { count: 'exact', head: true }).eq('pathway_id', p.id),
      ])
      return {
        ...mapRow(p),
        _region_count: regRes.count ?? 0,
        _symptom_count: symRes.count ?? 0,
        _condition_count: condRes.count ?? 0,
      }
    }))

    return { data: enriched as ClinicalPathway[], count: count ?? 0 }
  } catch (err) {
    console.error('[getPathways]', err)
    return { data: [], count: 0 }
  }
}

// ── Get pathway by ID with all relations ──────────────────────

export interface PathwayWithRelations extends ClinicalPathway {
  body_regions: BodyRegion[]
  linked_symptoms: Symptom[]
  linked_conditions: Array<Condition & { confidence_level: string; display_order: number }>
  references: MedicalReference[]
}

export async function getPathwayById(id: string): Promise<PathwayWithRelations | null> {
  const sb = getClient()

  try {
    const { data: pathway, error } = await sb
      .from('clinical_pathways')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !pathway) return null

    const [regRes, symRes, condRes, refRes] = await Promise.all([
      sb.from('pathway_body_regions').select('region_slug, region_name_th, region_name_en, sort_order').eq('pathway_id', id).order('sort_order'),
      sb.from('pathway_symptoms').select('symptom_slug, name_th, name_en, is_primary, sort_order').eq('pathway_id', id).order('sort_order'),
      sb.from('pathway_conditions').select('condition_slug, condition_name_th, condition_name_en, strength, sort_order').eq('pathway_id', id).order('sort_order'),
      sb.from('entity_references').select('reference:medical_references(*)').eq('entity_type', 'pathway').eq('entity_id', id),
    ])

    // Hydrate regions from body_regions table
    const regionSlugs = (regRes.data ?? []).map((r: Record<string, unknown>) => r.region_slug as string)
    let fullRegions: BodyRegion[] = []
    if (regionSlugs.length > 0) {
      const { data: rbData } = await sb.from('body_regions').select('*').in('slug', regionSlugs)
      fullRegions = (rbData ?? []) as BodyRegion[]
    }

    return {
      ...mapRow(pathway as Record<string, unknown>),
      body_regions: fullRegions,
      linked_symptoms: (symRes.data ?? []).map((r: Record<string, unknown>) => ({
        id: r.symptom_slug as string,
        name_th: r.name_th as string,
        name_en: r.name_en as string,
        is_primary: r.is_primary as boolean,
      } as unknown as Symptom)),
      linked_conditions: (condRes.data ?? []).map((r: Record<string, unknown>) => ({
        id: r.condition_slug as string,
        name_th: r.condition_name_th as string,
        name_en: r.condition_name_en as string,
        confidence_level: r.strength as string,
        display_order: r.sort_order as number,
      } as unknown as Condition & { confidence_level: string; display_order: number })),
      references: (refRes.data ?? []).map((r: Record<string, unknown>) => r.reference as MedicalReference),
    }
  } catch (err) {
    console.error('[getPathwayById]', err)
    return null
  }
}

// ── Create pathway ────────────────────────────────────────────

export async function createPathway(data: PathwayFormData): Promise<ClinicalPathway> {
  const sb = getClient()

  const slug = data.name_en
    ? toSlug(data.name_en)
    : `pathway-${Date.now()}`

  const payload = {
    slug,
    name_th: data.name_th,
    name_en: data.name_en || null,
    description_th: data.description_th || null,
    specialty: data.specialty || 'general',
    status: 'draft',
    evidence_level: data.evidence_level || null,
    reviewer_name: data.reviewer_name || null,
    disclaimer_th: data.disclaimer_th || null,
    tags: data.tags ?? [],
    aliases: data.aliases ?? [],
    screening_questions: data.screening_questions ?? [],
    red_flags_jsonb: data.red_flags ?? [],
    recommendations_jsonb: data.recommendations ?? [],
  }

  const { data: created, error } = await sb.from('clinical_pathways').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return mapRow(created as Record<string, unknown>)
}

// ── Update pathway ────────────────────────────────────────────

export async function updatePathway(id: string, updates: Partial<PathwayFormData>): Promise<ClinicalPathway> {
  const sb = getClient()

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.name_th !== undefined) payload.name_th = updates.name_th
  if (updates.name_en !== undefined) payload.name_en = updates.name_en
  if (updates.description_th !== undefined) payload.description_th = updates.description_th
  if (updates.specialty !== undefined) payload.specialty = updates.specialty
  if (updates.evidence_level !== undefined) payload.evidence_level = updates.evidence_level || null
  if (updates.reviewer_name !== undefined) payload.reviewer_name = updates.reviewer_name || null
  if (updates.disclaimer_th !== undefined) payload.disclaimer_th = updates.disclaimer_th
  if (updates.tags !== undefined) payload.tags = updates.tags
  if (updates.aliases !== undefined) payload.aliases = updates.aliases
  if (updates.screening_questions !== undefined) payload.screening_questions = updates.screening_questions
  if (updates.red_flags !== undefined) payload.red_flags_jsonb = updates.red_flags
  if (updates.recommendations !== undefined) payload.recommendations_jsonb = updates.recommendations

  const { data, error } = await sb.from('clinical_pathways').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return mapRow(data as Record<string, unknown>)
}

// ── Update pathway status ─────────────────────────────────────

export async function updatePathwayStatus(
  id: string,
  status: ContentStatus,
  reviewer?: string
): Promise<ClinicalPathway> {
  const sb = getClient()
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setMonth(expiresAt.getMonth() + 24)

  const updates: Record<string, unknown> = { status, updated_at: now.toISOString() }
  if (status === 'approved' || status === 'published') {
    updates.review_date = now.toISOString()
    updates.expires_at = expiresAt.toISOString()
    if (reviewer) updates.reviewer_name = reviewer
  }

  const { data, error } = await sb.from('clinical_pathways').update(updates).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return mapRow(data as Record<string, unknown>)
}

// ── Link pathway → conditions ─────────────────────────────────

export async function linkPathwayConditions(
  pathwayId: string,
  conditions: Array<{ condition_id: string; confidence_level: string; display_order: number }>
): Promise<void> {
  const sb = getClient()
  await sb.from('pathway_conditions').delete().eq('pathway_id', pathwayId)
  if (conditions.length === 0) return

  const ids = conditions.map(c => c.condition_id)
  const { data: condData } = await sb.from('conditions').select('id, name_th, name_en, slug').in('id', ids)
  const condMap = Object.fromEntries((condData ?? []).map((c: Record<string, unknown>) => [c.id as string, c]))

  const rows = conditions.map(c => {
    const cond = condMap[c.condition_id] as Record<string, unknown> | undefined
    return {
      pathway_id: pathwayId,
      condition_slug: (cond?.slug as string) ?? c.condition_id,
      condition_name_th: (cond?.name_th as string) ?? '',
      condition_name_en: (cond?.name_en as string) ?? null,
      strength: c.confidence_level,
      sort_order: c.display_order,
    }
  })

  const { error } = await sb.from('pathway_conditions').insert(rows)
  if (error) throw new Error(error.message)
}

// ── Link pathway → symptoms ───────────────────────────────────

export async function linkPathwaySymptoms(
  pathwayId: string,
  symptoms: Array<{ symptom_id: string; is_primary: boolean }>
): Promise<void> {
  const sb = getClient()
  await sb.from('pathway_symptoms').delete().eq('pathway_id', pathwayId)
  if (symptoms.length === 0) return

  const ids = symptoms.map(s => s.symptom_id)
  const { data: symData } = await sb.from('symptoms').select('id, name_th, name_en, slug').in('id', ids)
  const symMap = Object.fromEntries((symData ?? []).map((s: Record<string, unknown>) => [s.id as string, s]))

  const rows = symptoms.map((s, i) => {
    const sym = symMap[s.symptom_id] as Record<string, unknown> | undefined
    return {
      pathway_id: pathwayId,
      symptom_slug: (sym?.slug as string) ?? s.symptom_id,
      name_th: (sym?.name_th as string) ?? '',
      name_en: (sym?.name_en as string) ?? null,
      is_primary: s.is_primary,
      sort_order: i,
    }
  })

  const { error } = await sb.from('pathway_symptoms').insert(rows)
  if (error) throw new Error(error.message)
}

// ── Link pathway → body regions ───────────────────────────────

export async function linkPathwayRegions(pathwayId: string, regionIds: string[]): Promise<void> {
  const sb = getClient()

  // Use the FK-based pathway_regions table from migration 005
  await sb.from('pathway_regions').delete().eq('pathway_id', pathwayId)
  if (regionIds.length === 0) return

  const rows = regionIds.map(region_id => ({ pathway_id: pathwayId, region_id }))
  const { error } = await sb.from('pathway_regions').insert(rows)
  if (error) throw new Error(error.message)

  // Also sync the slug-based pathway_body_regions table (004) for backward compat
  const { data: regData } = await sb.from('body_regions').select('id, slug, name_th, name_en').in('id', regionIds)
  await sb.from('pathway_body_regions').delete().eq('pathway_id', pathwayId)
  if (regData && regData.length > 0) {
    const legacyRows = (regData as Record<string, unknown>[]).map((r, i) => ({
      pathway_id: pathwayId,
      region_slug: r.slug as string,
      region_name_th: r.name_th as string,
      region_name_en: r.name_en as string,
      sort_order: i,
    }))
    await sb.from('pathway_body_regions').insert(legacyRows)
  }
}

// ── Completeness calculator (local, no API) ───────────────────

export interface PathwayDraftForCompleteness {
  name_th?: string
  specialty?: string
  description_th?: string
  screening_questions?: unknown[]
  red_flags?: unknown[]
  recommendations?: unknown[]
  evidence_level?: string
  reviewer_name?: string
  linked_condition_count?: number
}

export function calcPathwayCompleteness(data: PathwayDraftForCompleteness): number {
  const checks: Array<[() => boolean, number]> = [
    [() => !!data.name_th?.trim(), 10],
    [() => !!data.specialty, 10],
    [() => !!data.description_th?.trim(), 10],
    [() => Array.isArray(data.screening_questions) && data.screening_questions.length > 0, 15],
    [() => Array.isArray(data.red_flags) && data.red_flags.length > 0, 15],
    [() => Array.isArray(data.recommendations) && data.recommendations.length > 0, 15],
    [() => (data.linked_condition_count ?? 0) > 0, 10],
    [() => !!data.evidence_level, 10],
    [() => !!data.reviewer_name?.trim(), 5],
  ]
  return checks.reduce((sum, [fn, w]) => sum + (fn() ? w : 0), 0)
}
