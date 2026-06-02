import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getPathwayById, updatePathway, updatePathwayStatus } from '@/lib/db/pathways'
import { createClient } from '@supabase/supabase-js'
import type { ContentStatus, PathwayFormData } from '@/types/medical'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

type RouteContext = { params: Promise<{ id: string }> }

// ── GET — single pathway with all relations ───────────────────

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  try {
    const pathway = await getPathwayById(id)
    if (!pathway) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pathway)
  } catch (err) {
    console.error('[admin/pathways/[id] GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── PATCH — partial update with publish validation ────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  let body: Partial<PathwayFormData> & { status?: ContentStatus }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    if (body.status === 'published') {
      const existing = await getPathwayById(id)
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const evidenceLevel = body.evidence_level ?? existing.evidence_level
      const reviewerName  = body.reviewer_name  ?? existing.reviewer_name

      if (!evidenceLevel) {
        return NextResponse.json(
          { error: 'evidence_level is required before publishing', field: 'evidence_level' },
          { status: 400 }
        )
      }
      if (!reviewerName?.trim()) {
        return NextResponse.json(
          { error: 'reviewer_name is required before publishing', field: 'reviewer_name' },
          { status: 400 }
        )
      }
    }

    const { status, ...updates } = body
    if (Object.keys(updates).length > 0) {
      await updatePathway(id, updates as Partial<PathwayFormData>)
    }
    if (status) {
      await updatePathwayStatus(id, status, body.reviewer_name)
    }

    const updated = await getPathwayById(id)
    return NextResponse.json(updated)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed'
    console.error('[admin/pathways/[id] PATCH]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// ── DELETE — soft delete ──────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  try {
    const sb = getClient()
    const { error } = await sb
      .from('clinical_pathways')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true, status: 'archived' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Archive failed'
    console.error('[admin/pathways/[id] DELETE]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
