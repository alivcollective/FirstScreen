import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAIUsageStatus, trackAIUsage } from '@/lib/db/conditions'
import type { AIAutofillResponse } from '@/types/medical'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'
const ADMIN_USER_ID = process.env.ADMIN_EMAIL ?? 'admin@firstscreen.health'

function getAdminUserId(req: NextRequest): string {
  const session = req.cookies.get('admin_session')
  return session ? ADMIN_USER_ID : 'anonymous'
}

// ── GET — return current daily usage ─────────────────────────

export async function GET(req: NextRequest) {
  try {
    const userId = getAdminUserId(req)
    const usage = await getAIUsageStatus(userId)
    return NextResponse.json({ usage })
  } catch (err) {
    console.error('[autofill-condition GET]', err)
    return NextResponse.json({ usage: { used: 0, limit: 10, remaining: 10, resets_at: '' } })
  }
}

// ── POST — autofill condition from name_th ────────────────────

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  let body: { name_th?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name_th } = body
  if (!name_th?.trim()) {
    return NextResponse.json({ error: 'name_th is required' }, { status: 400 })
  }

  const userId = getAdminUserId(req)

  // Rate limit check
  const usage = await getAIUsageStatus(userId)
  if (usage.remaining <= 0) {
    return NextResponse.json(
      { error: 'Daily AI limit reached', usage },
      { status: 429 }
    )
  }

  const prompt = buildPrompt(name_th.trim())

  let raw: string
  let tokensUsed = 0

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[autofill-condition] Anthropic error', response.status, errText)
      return NextResponse.json(
        { error: `Anthropic API error: ${response.status}` },
        { status: 502 }
      )
    }

    const json = await response.json()
    raw = json.content?.[0]?.text ?? ''
    tokensUsed = (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0)
  } catch (err) {
    console.error('[autofill-condition] fetch error', err)
    return NextResponse.json({ error: 'Failed to reach AI service' }, { status: 502 })
  }

  // Strip markdown fences if present
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  let result: AIAutofillResponse
  try {
    result = JSON.parse(cleaned)
  } catch {
    console.error('[autofill-condition] JSON parse failed, raw:', raw.slice(0, 200))
    return NextResponse.json({ error: 'AI returned invalid JSON', raw: raw.slice(0, 500) }, { status: 502 })
  }

  await trackAIUsage(userId, 'autofill_condition', tokensUsed)
  const updatedUsage = await getAIUsageStatus(userId)

  return NextResponse.json({ result, usage: updatedUsage })
}

// ── Prompt builder ────────────────────────────────────────────

function buildPrompt(name_th: string): string {
  return `You are a Thai medical knowledge assistant for FirstScreen, a healthcare navigation platform. Given a Thai medical condition name, return ONLY a valid JSON object with no preamble, no explanation, and no markdown fences.

Thai condition name: "${name_th}"

Return a JSON object with EXACTLY these fields:
{
  "name_en": "English name of the condition",
  "description_th": "คำอธิบายภาษาไทย 2-3 ประโยค อธิบายว่าโรคนี้คืออะไร สาเหตุหลัก และลักษณะทั่วไป",
  "icd11_suggestion": "ICD-11 code if known, otherwise null",
  "aliases": ["alternative Thai name 1", "alternative Thai name 2"],
  "symptoms": ["อาการ 1", "อาการ 2", "อาการ 3", "อาการ 4", "อาการ 5"],
  "red_flags": ["สัญญาณอันตราย 1", "สัญญาณอันตราย 2"],
  "age_group": "all" or "child" or "teen" or "adult" or "elderly",
  "sex_predominant": "all" or "male" or "female",
  "evidence_level": "high" or "moderate" or "low" or "expert_opinion",
  "references": [
    { "title": "Reference title in English", "source": "Journal or organization name", "year": 2024 }
  ]
}

Rules:
- All text fields must be in the language specified (name_en in English, description_th in Thai, symptoms and red_flags in Thai)
- symptoms: list 4-6 most common symptoms
- red_flags: list 2-4 warning signs requiring immediate medical attention
- references: provide 1-3 real published guidelines or studies, not fictional
- Return ONLY the JSON object, nothing else`
}
