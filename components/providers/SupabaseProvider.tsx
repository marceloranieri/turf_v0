'use client'

import { useState, createContext, useContext } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { Database } from '@/types/supabase'

const SupabaseContext = createContext<any>(null)

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
    <SupabaseContext.Provider value={supabase}>
      <SessionContextProvider supabaseClient={supabase as any}>
        {children}
      </SessionContextProvider>
    </SupabaseContext.Provider>
  )
}

// ✅ Fixes "not exported" build error
export function useSupabase() {
  return useContext(SupabaseContext)
} 