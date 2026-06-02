import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAIUsageStatus, trackAIUsage } from '@/lib/db/conditions'
import type { AIUsageStatus } from '@/types/medical'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'
const ADMIN_USER_ID = process.env.ADMIN_EMAIL ?? 'admin@firstscreen.health'

export interface PathwayAutofillResponse {
  name_en: string
  description_th: string
  screening_questions: Array<{
    id: string
    question_th: string
    question_en: string
    type: 'yes_no' | 'multiple_choice' | 'scale_1_10'
    options: string[]
    red_flag_trigger: boolean
  }>
  red_flags: Array<{
    title_th: string
    description_th: string
    urgency: 'emergency' | 'urgent' | 'routine'
    action: 'call_ems' | 'go_er' | 'see_doctor_today' | 'monitor'
  }>
  recommendations: Array<{
    type: string
    title_th: string
    description_th: string
    evidence_level: string
  }>
  suggested_conditions: string[]
  evidence_level: string
}

function getAdminUserId(req: NextRequest): string {
  const session = req.cookies.get('admin_session')
  return session ? ADMIN_USER_ID : 'anonymous'
}

export async function GET(req: NextRequest) {
  try {
    const usage = await getAIUsageStatus(getAdminUserId(req))
    return NextResponse.json({ usage })
  } catch {
    return NextResponse.json({ usage: { used: 0, limit: 10, remaining: 10, resets_at: '' } })
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })

  let body: { name_th?: string; specialty?: string; body_region?: string }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!body.name_th?.trim()) {
    return NextResponse.json({ error: 'name_th is required' }, { status: 400 })
  }

  const userId = getAdminUserId(req)
  const usage = await getAIUsageStatus(userId)
  if (usage.remaining <= 0) {
    return NextResponse.json({ error: 'Daily AI limit reached', usage }, { status: 429 })
  }

  let raw = ''
  let tokensUsed = 0

  try {
    const resp = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        messages: [{ role: 'user', content: buildPrompt(body.name_th.trim(), body.specialty ?? 'general', body.body_region) }],
      }),
    })
    if (!resp.ok) {
      const t = await resp.text()
      console.error('[autofill-pathway] Anthropic error', resp.status, t)
      return NextResponse.json({ error: `Anthropic API error: ${resp.status}` }, { status: 502 })
    }
    const json = await resp.json()
    raw = json.content?.[0]?.text ?? ''
    tokensUsed = (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0)
  } catch (err) {
    console.error('[autofill-pathway] fetch error', err)
    return NextResponse.json({ error: 'Failed to reach AI service' }, { status: 502 })
  }

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

  let result: PathwayAutofillResponse
  try {
    result = JSON.parse(cleaned)
  } catch {
    console.error('[autofill-pathway] JSON parse failed:', raw.slice(0, 200))
    return NextResponse.json({ error: 'AI returned invalid JSON', raw: raw.slice(0, 500) }, { status: 502 })
  }

  await trackAIUsage(userId, 'autofill_pathway', tokensUsed)
  const updatedUsage: AIUsageStatus = await getAIUsageStatus(userId)

  return NextResponse.json({ result, usage: updatedUsage })
}

function buildPrompt(name_th: string, specialty: string, body_region?: string): string {
  return `You are a Thai clinical pathway builder assistant for FirstScreen, a healthcare navigation platform.

Given this clinical pathway name and context, return ONLY a valid JSON object. No preamble, no markdown.

Pathway name (Thai): "${name_th}"
Medical specialty: "${specialty}"${body_region ? `\nBody region: "${body_region}"` : ''}

Return a JSON object with EXACTLY these fields:
{
  "name_en": "English name of this clinical pathway",
  "description_th": "คำอธิบายเส้นทางคลินิกนี้ 2-3 ประโยค",
  "screening_questions": [
    {
      "id": "q1",
      "question_th": "คำถามภาษาไทย?",
      "question_en": "Question in English?",
      "type": "yes_no",
      "options": [],
      "red_flag_trigger": false
    }
  ],
  "red_flags": [
    {
      "title_th": "ชื่อสัญญาณอันตราย",
      "description_th": "คำอธิบายสัญญาณอันตราย",
      "urgency": "emergency",
      "action": "call_ems"
    }
  ],
  "recommendations": [
    {
      "type": "self_care",
      "title_th": "ชื่อคำแนะนำ",
      "description_th": "รายละเอียดคำแนะนำ",
      "evidence_level": "moderate"
    }
  ],
  "suggested_conditions": ["ชื่อโรค/ภาวะ 1", "ชื่อโรค/ภาวะ 2", "ชื่อโรค/ภาวะ 3"],
  "evidence_level": "moderate"
}

Rules:
- screening_questions: 4-6 questions appropriate for this pathway, in Thai
- At least 1 question should have red_flag_trigger: true
- red_flags: 2-4 warning signs requiring immediate action
- recommendations: 3-5 actionable recommendations
- suggested_conditions: 3-5 Thai names of conditions this pathway might diagnose
- type options: "yes_no", "multiple_choice", "scale_1_10"
- urgency options: "emergency", "urgent", "routine"
- action options: "call_ems", "go_er", "see_doctor_today", "monitor"
- evidence_level options: "high", "moderate", "low", "expert_opinion"
- Return ONLY the JSON object, nothing else`
}
