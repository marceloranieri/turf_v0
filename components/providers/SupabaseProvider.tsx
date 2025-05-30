'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useState, createContext, useContext, useEffect } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const SupabaseContext = createContext<SupabaseClient<Database> | null>(null)

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    setSupabase(client)
    setIsInitialized(true)
  }, [])

  if (!isInitialized) {
    return null // or a loading spinner
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  return useContext(SupabaseContext)
} 