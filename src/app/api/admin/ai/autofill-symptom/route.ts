import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAIUsageStatus, trackAIUsage } from '@/lib/db/conditions'
import type { AIUsageStatus } from '@/types/medical'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'
const ADMIN_USER_ID = process.env.ADMIN_EMAIL ?? 'admin@firstscreen.health'

export interface SymptomAutofillResponse {
  name_en: string
  description_th: string
  icd11_suggestion: string
  severity_weight: 1 | 2 | 3 | 4
  is_emergency: boolean
  aliases: string[]
  follow_up_questions: Array<{
    key: string
    q_th: string
    q_en: string
    type: 'yes_no' | 'multiple_choice' | 'scale_1_10' | 'duration' | 'text'
    options: string[]
  }>
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

  let body: { name_th?: string; body_region?: string; system?: string }
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
        max_tokens: 1200,
        messages: [{ role: 'user', content: buildPrompt(body.name_th.trim(), body.body_region, body.system) }],
      }),
    })
    if (!resp.ok) {
      const t = await resp.text()
      console.error('[autofill-symptom] Anthropic error', resp.status, t)
      return NextResponse.json({ error: `Anthropic API error: ${resp.status}` }, { status: 502 })
    }
    const json = await resp.json()
    raw = json.content?.[0]?.text ?? ''
    tokensUsed = (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0)
  } catch (err) {
    console.error('[autofill-symptom] fetch error', err)
    return NextResponse.json({ error: 'Failed to reach AI service' }, { status: 502 })
  }

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

  let result: SymptomAutofillResponse
  try {
    result = JSON.parse(cleaned)
  } catch {
    console.error('[autofill-symptom] JSON parse failed:', raw.slice(0, 200))
    return NextResponse.json({ error: 'AI returned invalid JSON', raw: raw.slice(0, 500) }, { status: 502 })
  }

  await trackAIUsage(userId, 'autofill_symptom', tokensUsed)
  const updatedUsage: AIUsageStatus = await getAIUsageStatus(userId)

  return NextResponse.json({ result, usage: updatedUsage })
}

function buildPrompt(name_th: string, body_region?: string, system?: string): string {
  return `You are a Thai medical symptom assistant for FirstScreen. Given a Thai symptom name, return ONLY valid JSON.

Symptom name (Thai): "${name_th}"${body_region ? `\nBody region: "${body_region}"` : ''}${system ? `\nBody system: "${system}"` : ''}

Return a JSON object with EXACTLY these fields:
{
  "name_en": "Symptom name in English",
  "description_th": "คำอธิบายอาการภาษาไทย 1-2 ประโยค",
  "icd11_suggestion": "ICD-11 symptom code or null",
  "severity_weight": 2,
  "is_emergency": false,
  "aliases": ["ชื่อเรียกอื่น 1"],
  "follow_up_questions": [
    {
      "key": "q1",
      "q_th": "คำถามภาษาไทย?",
      "q_en": "Question in English?",
      "type": "yes_no",
      "options": []
    }
  ]
}

Rules:
- severity_weight: 1 (mild) to 4 (critical/emergency) — integer only
- is_emergency: true only if symptom requires immediate 1669 response
- aliases: 0-3 common Thai alternative names for this symptom
- follow_up_questions: 3-5 OLDCARTS-style questions (Onset, Location, Duration, Character, Aggravating, Relieving, Timing, Severity)
- type options: "yes_no", "multiple_choice", "scale_1_10", "duration", "text"
- For scale_1_10 questions, options array should be empty
- For multiple_choice, include 3-5 Thai options in the options array
- Return ONLY the JSON object, nothing else`
}
