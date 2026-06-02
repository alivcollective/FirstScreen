// KMS Supabase Client — server-side queries
// Uses service_role key for admin operations

import type { KmsArticle, KmsArticleInput, KmsCondition, KmsSymptom, KmsBodyRegion, KmsAthleteCondition, KmsListParams, PaginatedResponse, KmsAnalyticsEvent } from '@/types/kms'

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// ── Articles ──────────────────────────────────────────────────

export async function listArticles(params: KmsListParams = {}): Promise<PaginatedResponse<KmsArticle>> {
  const sb = getSupabase()
  if (!sb) return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }

  const { page = 1, pageSize = 20, search, status, category, sortBy = 'updated_at', sortDir = 'desc' } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = sb.from('kms_articles')
    .select('*, category:kms_categories(id,name_th,name_en,slug), author:kms_authors(id,name,specialty)', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, to)

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category_id', category)
  if (search) query = query.ilike('title_th', `%${search}%`)

  const { data, count, error } = await query
  if (error) { console.error('[KMS articles]', error); return { data: [], total: 0, page, pageSize, totalPages: 0 } }

  return { data: data ?? [], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

export async function getArticle(id: string): Promise<KmsArticle | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.from('kms_articles')
    .select('*, category:kms_categories(*), author:kms_authors(*), reviewer:kms_authors(*)')
    .eq('id', id).single()
  return data
}

export async function createArticle(input: KmsArticleInput): Promise<KmsArticle | null> {
  const sb = getSupabase()
  if (!sb) return null
  const slug = input.slug || slugify(input.title_th)
  const { data, error } = await sb.from('kms_articles').insert({ ...input, slug }).select().single()
  if (error) { console.error('[KMS create article]', error); return null }
  return data
}

export async function updateArticle(id: string, input: Partial<KmsArticleInput>): Promise<KmsArticle | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('kms_articles').update(input).eq('id', id).select().single()
  if (error) { console.error('[KMS update article]', error); return null }
  return data
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

  let query = sb.from('kms_conditions')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('name_th')
    .range(from, from + pageSize - 1)

  if (search) query = query.ilike('name_th', `%${search}%`)

  const { data, count } = await query
  return { data: data ?? [], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

export async function getCondition(slug: string): Promise<KmsCondition | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.from('kms_conditions').select('*').eq('slug', slug).single()
  return data
}

export async function upsertCondition(condition: Partial<KmsCondition>): Promise<KmsCondition | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('kms_conditions')
    .upsert({ ...condition, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
    .select().single()
  if (error) { console.error('[KMS upsert condition]', error); return null }
  return data
}

// ── Symptoms ──────────────────────────────────────────────────

export async function listSymptoms(params: KmsListParams = {}): Promise<PaginatedResponse<KmsSymptom>> {
  const sb = getSupabase()
  if (!sb) return { data: [], total: 0, page: 1, pageSize: 50, totalPages: 0 }

  const { page = 1, pageSize = 50, search } = params
  const from = (page - 1) * pageSize

  let query = sb.from('kms_symptoms')
    .select('*', { count: 'exact' })
    .eq('is_active', true).order('name_th').range(from, from + pageSize - 1)

  if (search) query = query.ilike('name_th', `%${search}%`)

  const { data, count } = await query
  return { data: data ?? [], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

// ── Athlete Conditions ────────────────────────────────────────

export async function listAthleteConditions(params: KmsListParams = {}): Promise<PaginatedResponse<KmsAthleteCondition>> {
  const sb = getSupabase()
  if (!sb) return { data: [], total: 0, page: 1, pageSize: 50, totalPages: 0 }

  const { page = 1, pageSize = 50, search } = params
  const from = (page - 1) * pageSize

  let query = sb.from('kms_athlete_conditions')
    .select('*', { count: 'exact' })
    .eq('is_active', true).order('name_th').range(from, from + pageSize - 1)

  if (search) query = query.ilike('name_th', `%${search}%`)

  const { data, count } = await query
  return { data: data ?? [], total: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) }
}

// ── Analytics ─────────────────────────────────────────────────

export async function trackEvent(event: KmsAnalyticsEvent): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  await sb.from('kms_analytics').insert(event)
}

export async function getAnalyticsSummary() {
  const sb = getSupabase()
  if (!sb) return null

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [articles, conditions, events] = await Promise.all([
    sb.from('kms_articles').select('status, view_count', { count: 'exact' }),
    sb.from('kms_conditions').select('id', { count: 'exact' }),
    sb.from('kms_analytics').select('event_type').gte('created_at', since),
  ])

  const byStatus = (articles.data ?? []).reduce((acc: Record<string, number>, a: { status: string }) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  const totalViews = (articles.data ?? []).reduce((sum: number, a: { view_count: number }) => sum + (a.view_count ?? 0), 0)

  const eventCounts = (events.data ?? []).reduce((acc: Record<string, number>, e: { event_type: string }) => {
    acc[e.event_type] = (acc[e.event_type] ?? 0) + 1
    return acc
  }, {})

  return {
    articles: { total: articles.count ?? 0, byStatus, totalViews },
    conditions: { total: conditions.count ?? 0 },
    events: eventCounts,
  }
}

// ── Utility ───────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[฀-๿]/g, (char) => {
      const code = char.charCodeAt(0)
      return code.toString(16)
    })
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || `article-${Date.now()}`
}
