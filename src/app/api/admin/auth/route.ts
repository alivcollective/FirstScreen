import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Credentials — configured via .env.local
// Default: admin@firstscreen.health / FirstScreenAdmin123!
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@firstscreen.health'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'FirstScreenAdmin123!'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'fs-admin-secret-2026-xK9mP3qR'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('admin_session', SESSION_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('admin_session')
  return response
}
