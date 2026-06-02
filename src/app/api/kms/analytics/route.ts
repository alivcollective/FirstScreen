import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { trackEvent } from "@/lib/kms/client"
import type { KmsAnalyticsEvent } from "@/types/kms"

export async function POST(req: NextRequest) {
  const event: KmsAnalyticsEvent = await req.json()
  await trackEvent(event)
  return NextResponse.json({ ok: true })
}
