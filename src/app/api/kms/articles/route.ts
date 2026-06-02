import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { listArticles, createArticle, slugify } from "@/lib/kms/client"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const result = await listArticles({
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 20),
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") as any ?? undefined,
    category: searchParams.get("category") ?? undefined,
  })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.title_th) return NextResponse.json({ error: "title_th required" }, { status: 400 })
  if (!body.slug) body.slug = slugify(body.title_th)
  const article = await createArticle(body)
  if (!article) return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  return NextResponse.json(article, { status: 201 })
}
