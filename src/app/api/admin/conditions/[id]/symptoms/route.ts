import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { linkConditionSymptoms } from '@/lib/db/conditions'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

type RouteContext = { params: Promise<{ id: string }> }

// ── GET — list linked symptoms for a condition ────────────────

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const sb = getClient()

  try {
    const { data, error } = await sb
      .from('condition_symptoms')
      .select('*, symptom:symptoms(*)')
      .eq('condition_id', id)
      .order('is_primary', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    console.error('[condition symptoms GET]', err)
    return NextResponse.json({ data: [] }, { status: 500 })
  }
}

// ── POST — replace all symptom links for a condition ─────────

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  let body: { symptoms: Array<{ symptom_id: string; is_primary?: boolean; frequency?: string }> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    await linkConditionSymptoms(id, body.symptoms ?? [])
    return NextResponse.json({ ok: true, linked: (body.symptoms ?? []).length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to link symptoms'
    console.error('[condition symptoms POST]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
