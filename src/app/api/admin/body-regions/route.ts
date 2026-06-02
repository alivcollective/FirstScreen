import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { BodyRegion, ContentStatus } from '@/types/medical'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// ── GET — list all body regions ───────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') as ContentStatus | null
  const sb = getClient()

  try {
    let query = sb
      .from('body_regions')
      .select('*')
      .order('display_order', { ascending: true })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ data: (data ?? []) as BodyRegion[] })
  } catch (err) {
    console.error('[admin/body-regions GET]', err)
    return NextResponse.json({ data: [] }, { status: 500 })
  }
}

// ── POST — create new body region ────────────────────────────

export async function POST(req: NextRequest) {
  let body: {
    name_th?: string
    name_en?: string
    slug?: string
    parent_id?: string | null
    display_order?: number
    tags?: string[]
    status?: ContentStatus
    coord_front_x?: number | null
    coord_front_y?: number | null
    coord_back_x?: number | null
    coord_back_y?: number | null
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.name_th?.trim()) {
    return NextResponse.json({ error: 'name_th is required' }, { status: 400 })
  }
  if (!body.name_en?.trim()) {
    return NextResponse.json({ error: 'name_en is required' }, { status: 400 })
  }

  const slug =
    body.slug?.trim() ||
    (body.name_en ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') ||
    `region-${Date.now()}`

  const sb = getClient()

  // Check slug uniqueness
  const { data: existing } = await sb
    .from('body_regions')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: `Slug "${slug}" is already taken` }, { status: 409 })
  }

  try {
    const { data, error } = await sb
      .from('body_regions')
      .insert({
        slug,
        name_th: body.name_th.trim(),
        name_en: body.name_en.trim(),
        parent_id: body.parent_id ?? null,
        display_order: body.display_order ?? 0,
        tags: body.tags ?? [],
        status: body.status ?? 'draft',
        coord_front_x: body.coord_front_x ?? null,
        coord_front_y: body.coord_front_y ?? null,
        coord_back_x: body.coord_back_x ?? null,
        coord_back_y: body.coord_back_y ?? null,
      })
      .select('id, slug')
      .single()

    if (error) throw new Error(error.message)
    return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create region'
    console.error('[admin/body-regions POST]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
