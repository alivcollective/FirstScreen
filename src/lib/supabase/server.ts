import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/**
 * Server Supabase client (Server Components, Route Handlers, Server Actions).
 * Returns null gracefully if env vars are missing.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null

  const cookieStore = await cookies()
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}

/**
 * Service-role client for admin operations (migrations, seed scripts).
 * Never expose this client to the browser.
 */
export async function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured for admin operations.')
  }
  const cookieStore = await cookies()
  return createServerClient<Database>(SUPABASE_URL, serviceKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll() {},
    },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
