"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { useAuth } from "./auth-context"

type Profile = {
  id: string
  username: string
  full_name: string
  avatar_url: string
  created_at: string
}

type ProfileContextType = {
  profile: Profile | null
  loading: boolean
  error: Error | null
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, supabase } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load profile"))
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, supabase])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No user logged in")

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (error) throw error

      setProfile((prev) => prev ? { ...prev, ...updates } : null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update profile"))
      throw err
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, error, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
