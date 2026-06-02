import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const [pathway, regions, symptoms, questions, conditions, redFlags, recommendations, references] = await Promise.all([
    sb.from('clinical_pathways').select('*').eq('id', id).single(),
    sb.from('pathway_body_regions').select('*').eq('pathway_id', id).order('sort_order'),
    sb.from('pathway_symptoms').select('*').eq('pathway_id', id).order('sort_order'),
    sb.from('pathway_questions').select(`*, options:pathway_question_options(*)`).eq('pathway_id', id).order('sort_order'),
    sb.from('pathway_conditions').select('*').eq('pathway_id', id).order('sort_order'),
    sb.from('pathway_red_flags').select('*').eq('pathway_id', id).order('sort_order'),
    sb.from('pathway_recommendations').select('*').eq('pathway_id', id).order('sort_order'),
    sb.from('pathway_references').select('*').eq('pathway_id', id).order('sort_order'),
  ])

  if (!pathway.data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    ...pathway.data,
    body_regions: regions.data ?? [],
    symptoms: symptoms.data ?? [],
    questions: questions.data ?? [],
    conditions: conditions.data ?? [],
    red_flags: redFlags.data ?? [],
    recommendations: recommendations.data ?? [],
    references: references.data ?? [],
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data, error } = await sb.from('clinical_pathways').update({
    name_th: body.name_th, name_en: body.name_en,
    description_th: body.description_th, specialty: body.specialty,
    status: body.status, reviewer_name: body.reviewer_name,
    reviewer_specialty: body.reviewer_specialty, review_date: body.review_date,
    evidence_level: body.evidence_level,
  }).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { error } = await sb.from('clinical_pathways').update({ status: 'archived' }).eq('id', id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true })
}
