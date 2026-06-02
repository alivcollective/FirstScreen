import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { BodyRegion } from '@/types/medical'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

type RouteContext = { params: Promise<{ id: string }> }

// ── GET — single region with counts and children ──────────────

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const sb = getClient()

  try {
    const { data: region, error } = await sb
      .from('body_regions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !region) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const [symptomsRes, conditionsRes, childrenRes] = await Promise.all([
      sb.from('region_symptoms').select('*', { count: 'exact', head: true }).eq('region_id', id),
      sb.from('region_conditions').select('*', { count: 'exact', head: true }).eq('region_id', id),
      sb.from('body_regions').select('*').eq('parent_id', id).order('display_order'),
    ])

    return NextResponse.json({
      ...(region as BodyRegion),
      symptom_count: symptomsRes.count ?? 0,
      condition_count: conditionsRes.count ?? 0,
      children: (childrenRes.data ?? []) as BodyRegion[],
    })
  } catch (err) {
    console.error('[admin/body-regions/[id] GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── PATCH — update region fields ──────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const sb = getClient()

  let body: Partial<Omit<BodyRegion, 'id' | 'created_at'>>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Prevent id/created_at from being updated
  const { id: _id, created_at: _ca, ...safeUpdates } = body as Record<string, unknown>
  void _id; void _ca

  try {
    const { data, error } = await sb
      .from('body_regions')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return NextResponse.json(data as BodyRegion)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed'
    console.error('[admin/body-regions/[id] PATCH]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// ── DELETE — soft delete (status = 'archived') ────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const sb = getClient()

  try {
    const { error } = await sb
      .from('body_regions')
      .update({ status: 'archived' })
      .eq('id', id)

    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Delete failed'
    console.error('[admin/body-regions/[id] DELETE]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
