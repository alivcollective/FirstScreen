import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  // TODO: implement review-queue query with Supabase
  // Table: kms_review_queue
  const sb_url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sb_key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!sb_url || !sb_key) return NextResponse.json({ data: [], total: 0 })
  
  try {
    const { createClient } = await import("@supabase/supabase-js")
    const sb = createClient(sb_url, sb_key)
    const search = searchParams.get("search")
    const page = Number(searchParams.get("page") ?? 1)
    const pageSize = Number(searchParams.get("pageSize") ?? 50)
    const from = (page - 1) * pageSize
    
    let query = sb.from("kms_review_queue").select("*", { count: "exact" }).range(from, from + pageSize - 1)
    // Note: review-queue is a filtered articles view
    if (!search) query = query.eq('status', 'review')
    
    const { data, count } = await query
    return NextResponse.json({ data: data ?? [], total: count ?? 0 })
  } catch (e) {
    return NextResponse.json({ data: [], total: 0 })
  }
}
