import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { listSymptoms } from "@/lib/kms/client"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const result = await listSymptoms({
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 50),
    search: searchParams.get("search") ?? undefined,
  })
  return NextResponse.json(result)
}
