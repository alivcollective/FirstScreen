import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createCondition, getConditions } from '@/lib/db/conditions'
import type { ConditionFormData } from '@/types/medical'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  try {
    const result = await getConditions({
      status: (searchParams.get('status') as import('@/types/medical').ContentStatus) || undefined,
      specialty: searchParams.get('specialty') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      page: Number(searchParams.get('page') ?? 1),
      pageSize: Number(searchParams.get('pageSize') ?? 50),
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[admin/conditions GET]', err)
    return NextResponse.json({ data: [], total: 0 }, { status: 500 })
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
    return NextResponse.json(condition, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create condition'
    console.error('[admin/conditions POST]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
