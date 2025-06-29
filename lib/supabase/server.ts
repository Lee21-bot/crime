'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CookieOptions } from '@supabase/ssr'
import type { Database } from '../../types/database'

export async function createClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies()
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Cookie operations are handled by middleware
          // This is intentionally a no-op
        },
        remove(name: string, options: CookieOptions) {
          // Cookie operations are handled by middleware
          // This is intentionally a no-op
        }
      }
    }
  )
} 