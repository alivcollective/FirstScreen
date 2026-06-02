import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

// Must match the SESSION_SECRET fallback in /api/admin/auth/route.ts
const EXPECTED_SESSION = process.env.ADMIN_SESSION_SECRET ?? 'fs-admin-secret-2026-xK9mP3qR'

function adminAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow the login page
  if (pathname === '/admin/login') return NextResponse.next()

  // Check session cookie
  const adminSession = req.cookies.get('admin_session')?.value
  if (!adminSession || adminSession !== EXPECTED_SESSION) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin routes — check auth, skip i18n
  if (pathname.startsWith('/admin')) {
    return adminAuthMiddleware(req)
  }

  // API routes — skip entirely (handled by Next.js API router)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Public routes — apply i18n
  return intlMiddleware(req)
}

export const config = {
  // Exclude: static files, _next internals, og, sitemap, robots
  matcher: ['/((?!_next|_vercel|og|sitemap|robots|.*\\..*).*)'],
}
