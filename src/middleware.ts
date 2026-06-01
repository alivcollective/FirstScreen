import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Exclude: api routes, Next.js internals, static files, OG image, sitemap, robots
  matcher: ['/((?!api|_next|_vercel|og|sitemap|robots|.*\\..*).*)'],
}
