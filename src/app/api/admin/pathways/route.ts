import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getPathways, createPathway } from '@/lib/db/pathways'
import type { PathwayFormData } from '@/types/medical'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status   = searchParams.get('status') ?? undefined
  const specialty = searchParams.get('specialty') ?? undefined
  const search   = searchParams.get('search') ?? undefined
  const limit    = Math.min(Number(searchParams.get('limit') ?? 20), 100)
  const offset   = Number(searchParams.get('offset') ?? 0)

  try {
    const { data, count } = await getPathways({ status, specialty, search, limit, offset })
    const page = Math.floor(offset / limit) + 1
    const total_pages = Math.ceil(count / limit)
    return NextResponse.json({ data, count, page, total_pages })
  } catch (err) {
    console.error('[admin/pathways GET]', err)
    return NextResponse.json({ data: [], count: 0, page: 1, total_pages: 0 }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<PathwayFormData>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.name_th?.trim()) {
    return NextResponse.json({ error: 'name_th is required' }, { status: 400 })
  }

  try {
    const pathway = await createPathway({
      name_th: body.name_th.trim(),
      name_en: body.name_en?.trim() ?? '',
      specialty: body.specialty ?? 'general',
      description_th: body.description_th?.trim() ?? '',
      screening_questions: body.screening_questions ?? [],
      red_flags: body.red_flags ?? [],
      recommendations: body.recommendations ?? [],
      evidence_level: body.evidence_level ?? '',
      reviewer_name: body.reviewer_name?.trim() ?? '',
      disclaimer_th: body.disclaimer_th?.trim() ?? '',
      tags: body.tags ?? [],
      aliases: body.aliases ?? [],
    })
    return NextResponse.json({ id: pathway.id, slug: pathway.slug }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create pathway'
    console.error('[admin/pathways POST]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
