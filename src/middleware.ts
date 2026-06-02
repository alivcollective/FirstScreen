import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

// Simple admin auth — checks for session cookie set by /admin/login
function adminAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Login page always accessible
  if (pathname === '/admin/login') return NextResponse.next()
  
  // Check admin session cookie
  const adminSession = req.cookies.get('admin_session')?.value
  if (!adminSession || adminSession !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return NextResponse.next()
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Admin routes: apply simple auth, skip i18n
  if (pathname.startsWith('/admin')) {
    return adminAuthMiddleware(req)
  }
  
  // All other routes: apply i18n middleware
  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|og|sitemap|robots|.*\\..*).*)'],
}
