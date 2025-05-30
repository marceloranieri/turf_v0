'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useState, useMemo, createContext, useContext, useEffect } from 'react'

const SupabaseContext = createContext<any>(null)

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    setSupabase(client)
  }, [])

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext) 