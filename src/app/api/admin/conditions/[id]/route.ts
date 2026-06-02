import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getConditionById, updateCondition, updateConditionStatus } from '@/lib/db/conditions'
import { createClient } from '@supabase/supabase-js'
import type { ContentStatus, ConditionFormData } from '@/types/medical'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

type RouteContext = { params: Promise<{ id: string }> }

// ── GET — single condition with all relations ─────────────────

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    const condition = await getConditionById(id)
    if (!condition) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(condition)
  } catch (err) {
    console.error('[admin/conditions/[id] GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── PATCH — partial update with status validation ─────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  let body: Partial<ConditionFormData> & { status?: ContentStatus }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    // Validate before publishing
    if (body.status === 'published') {
      const existing = await getConditionById(id)
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const evidenceLevel = body.evidence_level ?? existing.evidence_level
      const reviewerName  = body.reviewer_name ?? existing.reviewer_name

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

    // Apply field updates first
    if (Object.keys(updates).length > 0) {
      await updateCondition(id, updates as Partial<ConditionFormData>)
    }

    // Apply status change separately (handles reviewed_at + expires_at)
    if (status) {
      await updateConditionStatus(id, status, body.reviewer_name)
    }

    const updated = await getConditionById(id)
    return NextResponse.json(updated)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed'
    console.error('[admin/conditions/[id] PATCH]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// ── DELETE — soft delete (set status = archived) ──────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    const sb = getClient()
    const { error } = await sb
      .from('conditions')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true, status: 'archived' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Archive failed'
    console.error('[admin/conditions/[id] DELETE]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
