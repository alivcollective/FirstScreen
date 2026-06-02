import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getArticle, updateArticle, deleteArticle } from "@/lib/kms/client"

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const article = await getArticle(id)
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(article)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const article = await updateArticle(id, body)
  if (!article) return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  return NextResponse.json(article)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ok = await deleteArticle(id)
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Failed" }, { status: 500 })
}
