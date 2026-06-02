import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createCondition } from '@/lib/db/conditions'
import { createClient } from '@supabase/supabase-js'
import type { ConditionFormData, ContentStatus } from '@/types/medical'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status   = searchParams.get('status') as ContentStatus | null
  const specialty = searchParams.get('specialty')
  const search   = searchParams.get('search')
  const limit    = Math.min(Number(searchParams.get('limit') ?? 20), 100)
  const offset   = Number(searchParams.get('offset') ?? 0)

  const sb = getClient()

  try {
    let query = sb
      .from('conditions')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (specialty) query = query.eq('specialty_required', specialty)
    if (search) {
      query = query.or(
        `name_th.ilike.%${search}%,name_en.ilike.%${search}%,icd11_code.ilike.%${search}%`
      )
    }

    const { data, count, error } = await query
    if (error) throw error

    const total = count ?? 0
    const page = Math.floor(offset / limit) + 1
    const total_pages = Math.ceil(total / limit)

    return NextResponse.json({ data: data ?? [], count: total, page, total_pages })
  } catch (err) {
    console.error('[admin/conditions GET]', err)
    return NextResponse.json({ data: [], count: 0, page: 1, total_pages: 0 }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<ConditionFormData>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.name_th?.trim()) {
    return NextResponse.json({ error: 'name_th is required' }, { status: 400 })
  }

  try {
    const condition = await createCondition({
      name_th: body.name_th.trim(),
      name_en: body.name_en?.trim() ?? '',
      icd11_code: body.icd11_code?.trim() ?? '',
      specialty: body.specialty ?? 'general',
      category: body.category ?? 'other',
      severity: body.severity || 'moderate',
      urgency_level: body.urgency_level ?? 1,
      description_th: body.description_th?.trim() ?? '',
      aliases: body.aliases ?? [],
      tags: body.tags ?? [],
      age_group: body.age_group || '',
      sex_predominant: body.sex_predominant || '',
      evidence_level: body.evidence_level || '',
      reviewer_name: body.reviewer_name?.trim() ?? '',
      disclaimer_th: body.disclaimer_th?.trim() ?? '',
    })
    return NextResponse.json({ id: condition.id, slug: condition.slug }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create condition'
    console.error('[admin/conditions POST]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
