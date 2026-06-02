import { createClient } from '@supabase/supabase-js'
import type { BodyRegion, Symptom, Condition, ClinicalPathway } from '@/types/medical'

export interface BodyRegionCoords {
  front_x?: number
  front_y?: number
  back_x?: number
  back_y?: number
}

export interface BodyRegionWithRelations extends BodyRegion {
  symptoms: Symptom[]
  conditions: Condition[]
  pathways: ClinicalPathway[]
}

export interface BodyRegionWithCounts extends BodyRegion {
  symptom_count: number
  condition_count: number
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// ── List body regions ─────────────────────────────────────────

export async function getBodyRegions(
  opts: { status?: string; parent_id?: string | null } = {}
): Promise<BodyRegion[]> {
  const sb = getClient()

  try {
    let query = sb
      .from('body_regions')
      .select('*')
      .order('display_order', { ascending: true })

    if (opts.status) query = query.eq('status', opts.status)
    if (opts.parent_id !== undefined) {
      if (opts.parent_id === null) {
        query = query.is('parent_id', null)
      } else {
        query = query.eq('parent_id', opts.parent_id)
      }
    }

    const { data, error } = await query
    if (error) throw error
    return (data ?? []) as BodyRegion[]
  } catch (err) {
    console.error('[getBodyRegions]', err)
    return []
  }
}

// ── Get body region by slug with counts ───────────────────────

export async function getBodyRegionBySlug(
  slug: string
): Promise<BodyRegionWithCounts | null> {
  const sb = getClient()

  try {
    const { data: region, error } = await sb
      .from('body_regions')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !region) return null

    const [symptomsCount, conditionsCount] = await Promise.all([
      sb
        .from('region_symptoms')
        .select('*', { count: 'exact', head: true })
        .eq('region_id', region.id),
      sb
        .from('region_conditions')
        .select('*', { count: 'exact', head: true })
        .eq('region_id', region.id),
    ])

    return {
      ...(region as BodyRegion),
      symptom_count: symptomsCount.count ?? 0,
      condition_count: conditionsCount.count ?? 0,
    }
  } catch (err) {
    console.error('[getBodyRegionBySlug]', err)
    return null
  }
}

// ── Update body region coordinates ───────────────────────────

export async function updateBodyRegionCoords(
  id: string,
  coords: BodyRegionCoords
): Promise<BodyRegion> {
  const sb = getClient()

  const updates: Record<string, number | undefined> = {}
  if (coords.front_x !== undefined) updates.coord_front_x = coords.front_x
  if (coords.front_y !== undefined) updates.coord_front_y = coords.front_y
  if (coords.back_x !== undefined) updates.coord_back_x = coords.back_x
  if (coords.back_y !== undefined) updates.coord_back_y = coords.back_y

  const { data, error } = await sb
    .from('body_regions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BodyRegion
}

// ── Get region with full relations ────────────────────────────

export async function getRegionWithRelations(
  id: string
): Promise<BodyRegionWithRelations | null> {
  const sb = getClient()

  try {
    const { data: region, error } = await sb
      .from('body_regions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !region) return null

    const [symptomsRes, conditionsRes, pathwaysRes] = await Promise.all([
      sb
        .from('region_symptoms')
        .select('symptom:symptoms(*)')
        .eq('region_id', id),
      sb
        .from('region_conditions')
        .select('condition:conditions(*)')
        .eq('region_id', id),
      sb
        .from('pathway_regions')
        .select('pathway:clinical_pathways(*)')
        .eq('region_id', id),
    ])

    return {
      ...(region as BodyRegion),
      symptoms: (symptomsRes.data ?? []).map(
        (r: Record<string, unknown>) => r.symptom as Symptom
      ),
      conditions: (conditionsRes.data ?? []).map(
        (r: Record<string, unknown>) => r.condition as Condition
      ),
      pathways: (pathwaysRes.data ?? []).map(
        (r: Record<string, unknown>) => r.pathway as ClinicalPathway
      ),
    }
  } catch (err) {
    console.error('[getRegionWithRelations]', err)
    return null
  }
}
