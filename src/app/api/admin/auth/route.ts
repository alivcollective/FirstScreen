import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'firstscreen-admin-2026'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'firstscreen-session-2026'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_session', SESSION_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('admin_session')
  return response
}
