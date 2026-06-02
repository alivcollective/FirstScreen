import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSymptoms } from '@/lib/db/symptoms'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const search      = searchParams.get('search') ?? undefined
  const body_region = searchParams.get('body_region') ?? undefined
  const limit       = Math.min(Number(searchParams.get('limit') ?? 10), 50)
  const offset      = Number(searchParams.get('offset') ?? 0)

  try {
    const result = await getSymptoms({ search, body_region, limit, offset })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[admin/symptoms GET]', err)
    return NextResponse.json({ data: [], count: 0 }, { status: 500 })
  }
}
