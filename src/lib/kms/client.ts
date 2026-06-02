// KMS Supabase Client — server-side only
// Uses service_role key for full access

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type {
  KmsArticle, KmsArticleInput, KmsCondition, KmsSymptom,
  KmsBodyRegion, KmsAthleteCondition, KmsListParams,
  PaginatedResponse, KmsAnalyticsEvent,
} from '@/types/kms'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// ── Slug helper ───────────────────────────────────────────────

export function slugify(text: string): string {
  if (!text) return `item-${Date.now()}`
  return text
    .toLowerCase()
    .replace(/[฀-๿]/g, (c) => c.charCodeAt(0).toString(16))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || `item-${Date.now()}`
}

// ── Articles ──────────────────────────────────────────────────

export async function listArticles(params: KmsListParams = {}): Promise<PaginatedResponse<KmsArticle>> {
  const sb = getSupabase()
  if (!sb) return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }

  const { page = 1, pageSize = 20, search, status, category, sortBy = 'updated_at', sortDir = 'desc' } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = sb.from('kms_articles')
    .select('*, category:kms_categories(id,name_th,name_en,slug), author:kms_authors!author_id(id,name,specialty,title)', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, to)

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category_id', category)
  if (search) query = query.ilike('title_th', `%${search}%`)

  const { data, count, error } = await query
  if (error) { console.error('[KMS listArticles]', error.message); return { data: [], total: 0, page, pageSize, totalPages: 0 } }
  return { data: (data ?? []) as KmsArticle[], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

export async function getArticle(id: string): Promise<KmsArticle | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('kms_articles')
    .select('*, category:kms_categories(*), author:kms_authors!author_id(*), reviewer:kms_authors!reviewer_id(*)')
    .eq('id', id).single()
  if (error) return null
  return data as KmsArticle
}

export async function createArticle(input: KmsArticleInput): Promise<KmsArticle | null> {
  const sb = getSupabase()
  if (!sb) return null
  const slug = input.slug || slugify(input.title_th)
  const { data, error } = await sb.from('kms_articles').insert({ ...input, slug }).select().single()
  if (error) { console.error('[KMS createArticle]', error.message); return null }
  return data as KmsArticle
}

export async function updateArticle(id: string, input: Partial<KmsArticleInput>): Promise<KmsArticle | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('kms_articles').update(input).eq('id', id).select().single()
  if (error) { console.error('[KMS updateArticle]', error.message); return null }
  return data as KmsArticle
}

export async function deleteArticle(id: string): Promise<boolean> {
  const sb = getSupabase()
  if (!sb) return false
  const { error } = await sb.from('kms_articles').delete().eq('id', id)
  return !error
}

// ── Conditions ────────────────────────────────────────────────

export async function listConditions(params: KmsListParams = {}): Promise<PaginatedResponse<KmsCondition>> {
  const sb = getSupabase()
  if (!sb) return { data: [], total: 0, page: 1, pageSize: 50, totalPages: 0 }
  const { page = 1, pageSize = 50, search } = params
  const from = (page - 1) * pageSize
  let query = sb.from('kms_conditions').select('*', { count: 'exact' }).order('name_th').range(from, from + pageSize - 1)
  if (search) query = query.ilike('name_th', `%${search}%`)
  const { data, count } = await query
  return { data: (data ?? []) as KmsCondition[], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

export async function upsertCondition(c: Partial<KmsCondition>): Promise<KmsCondition | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('kms_conditions').upsert({ ...c, updated_at: new Date().toISOString() }, { onConflict: 'slug' }).select().single()
  if (error) { console.error('[KMS upsertCondition]', error.message); return null }
  return data as KmsCondition
}

// ── Symptoms ──────────────────────────────────────────────────

export async function listSymptoms(params: KmsListParams = {}): Promise<PaginatedResponse<KmsSymptom>> {
  const sb = getSupabase()
  if (!sb) return { data: [], total: 0, page: 1, pageSize: 50, totalPages: 0 }
  const { page = 1, pageSize = 50, search } = params
  const from = (page - 1) * pageSize
  let query = sb.from('kms_symptoms').select('*', { count: 'exact' }).order('name_th').range(from, from + pageSize - 1)
  if (search) query = query.ilike('name_th', `%${search}%`)
  const { data, count } = await query
  return { data: (data ?? []) as KmsSymptom[], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

// ── Athlete Conditions ────────────────────────────────────────

export async function listAthleteConditions(params: KmsListParams = {}): Promise<PaginatedResponse<KmsAthleteCondition>> {
  const sb = getSupabase()
  if (!sb) return { data: [], total: 0, page: 1, pageSize: 50, totalPages: 0 }
  const { page = 1, pageSize = 50, search } = params
  const from = (page - 1) * pageSize
  let query = sb.from('kms_athlete_conditions').select('*', { count: 'exact' }).order('name_th').range(from, from + pageSize - 1)
  if (search) query = query.ilike('name_th', `%${search}%`)
  const { data, count } = await query
  return { data: (data ?? []) as KmsAthleteCondition[], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

// ── Analytics ─────────────────────────────────────────────────

export async function trackEvent(event: KmsAnalyticsEvent): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  await sb.from('kms_analytics').insert(event).then(({ error }) => {
    if (error) console.warn('[KMS analytics]', error.message)
  })
}

export async function getAnalyticsSummary() {
  const sb = getSupabase()
  if (!sb) return null
  try {
    const [articles, conditions, events] = await Promise.all([
      sb.from('kms_articles').select('status, view_count'),
      sb.from('kms_conditions').select('id', { count: 'exact', head: true }),
      sb.from('kms_analytics').select('event_type').gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
    ])
    const byStatus = ((articles.data ?? []) as { status: string; view_count: number }[]).reduce((acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1; return acc
    }, {} as Record<string, number>)
    const totalViews = ((articles.data ?? []) as { view_count: number }[]).reduce((s, a) => s + (a.view_count ?? 0), 0)
    const eventCounts = ((events.data ?? []) as { event_type: string }[]).reduce((acc, e) => {
      acc[e.event_type] = (acc[e.event_type] ?? 0) + 1; return acc
    }, {} as Record<string, number>)
    return {
      articles: { total: (articles.data ?? []).length, byStatus, totalViews },
      conditions: { total: conditions.count ?? 0 },
      events: eventCounts,
    }
  } catch (e) { return null }
}
