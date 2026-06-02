import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || `pathway-${Date.now()}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const search = searchParams.get('search') ?? ''
  const specialty = searchParams.get('specialty') ?? ''

  const sb = getSupabase()
  if (!sb) return NextResponse.json({ data: [], total: 0 })

  try {
    let query = sb.from('clinical_pathways').select('*', { count: 'exact' }).order('updated_at', { ascending: false })
    if (search) query = query.ilike('name_th', `%${search}%`)
    if (specialty) query = query.eq('specialty', specialty)
    const { data, count } = await query.limit(50)

    // Enrich with related data counts
    const enriched = await Promise.all((data ?? []).map(async (p: Record<string, unknown>) => {
      const [regions, symptoms, questions, conditions, redFlags] = await Promise.all([
        sb.from('pathway_body_regions').select('id', { count: 'exact' }).eq('pathway_id', p.id),
        sb.from('pathway_symptoms').select('id', { count: 'exact' }).eq('pathway_id', p.id),
        sb.from('pathway_questions').select('id', { count: 'exact' }).eq('pathway_id', p.id),
        sb.from('pathway_conditions').select('id', { count: 'exact' }).eq('pathway_id', p.id),
        sb.from('pathway_red_flags').select('id', { count: 'exact' }).eq('pathway_id', p.id),
      ])
      return {
        ...p,
        body_regions: Array(regions.count ?? 0).fill({}),
        symptoms: Array(symptoms.count ?? 0).fill({}),
        questions: Array(questions.count ?? 0).fill({}),
        conditions: Array(conditions.count ?? 0).fill({}),
        red_flags: Array(redFlags.count ?? 0).fill({}),
      }
    }))

    return NextResponse.json({ data: enriched, total: count ?? 0 })
  } catch (err) {
    console.error('[pathways GET]', err)
    return NextResponse.json({ data: [], total: 0 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const slug = slugify(body.name_th ?? 'pathway')

  try {
    // Insert pathway
    const { data: pathway, error } = await sb.from('clinical_pathways').insert({
      slug, name_th: body.name_th, name_en: body.name_en,
      description_th: body.description_th, specialty: body.specialty ?? 'general',
      status: body.status ?? 'draft',
      reviewer_name: body.reviewer_name, reviewer_specialty: body.reviewer_specialty,
      review_date: body.review_date, evidence_level: body.evidence_level ?? 'moderate',
    }).select().single()

    if (error || !pathway) return NextResponse.json({ error: error?.message ?? 'Insert failed' }, { status: 500 })

    const pid = pathway.id

    // Insert related entities
    await Promise.all([
      body.body_regions?.length && sb.from('pathway_body_regions').insert(
        body.body_regions.map((r: Record<string, unknown>, i: number) => ({ pathway_id: pid, ...r, sort_order: i }))
      ),
      body.symptoms?.length && sb.from('pathway_symptoms').insert(
        body.symptoms.map((s: Record<string, unknown>, i: number) => ({ pathway_id: pid, ...s, sort_order: i }))
      ),
      body.conditions?.length && sb.from('pathway_conditions').insert(
        body.conditions.map((c: Record<string, unknown>, i: number) => ({ pathway_id: pid, ...c, sort_order: i }))
      ),
      body.red_flags?.length && sb.from('pathway_red_flags').insert(
        body.red_flags.map((f: Record<string, unknown>, i: number) => ({ pathway_id: pid, ...f, sort_order: i }))
      ),
      body.recommendations?.length && sb.from('pathway_recommendations').insert(
        body.recommendations.map((r: Record<string, unknown>, i: number) => ({ pathway_id: pid, ...r, sort_order: i }))
      ),
      body.references?.length && sb.from('pathway_references').insert(
        body.references.map((r: Record<string, unknown>, i: number) => ({ pathway_id: pid, ...r, sort_order: i }))
      ),
    ].filter(Boolean))

    // Insert questions with their options
    if (body.questions?.length) {
      for (const q of body.questions) {
        const { data: savedQ } = await sb.from('pathway_questions').insert({
          pathway_id: pid, question_th: q.question_th, question_en: q.question_en,
          question_type: q.question_type, is_required: q.is_required,
          hint_th: q.hint_th, sort_order: q.sort_order ?? 0
        }).select().single()

        if (savedQ && q.options?.length) {
          await sb.from('pathway_question_options').insert(
            q.options.map((o: Record<string, unknown>, i: number) => ({
              question_id: savedQ.id, option_th: o.option_th, option_en: o.option_en, sort_order: i
            }))
          )
        }
      }
    }

    return NextResponse.json(pathway, { status: 201 })
  } catch (err) {
    console.error('[pathways POST]', err)
    return NextResponse.json({ error: 'Failed to create pathway' }, { status: 500 })
  }
}
