'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { Database } from '@/types/supabase'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: {
          name: 'sb',
          path: '/',
          sameSite: 'lax',
          secure: true,
        },
      }
    )
  )

  return (
    <SessionContextProvider supabaseClient={supabase as any}>
      {children}
    </SessionContextProvider>
  )
} 