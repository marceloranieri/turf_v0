"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-context"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"]

type ProfileContextType = {
  profile: Profile | null
  settings: UserSettings | null
  isLoading: boolean
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchSettings()
    } else {
      setProfile(null)
      setSettings(null)
      setIsLoading(false)
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      if (!user) return

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      if (!user) return

      const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

      if (error) throw error
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setIsLoading(true)
      if (!user) throw new Error("No user")

      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

      if (error) throw error
      setProfile({ ...profile!, ...updates })
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      setIsLoading(true)
      if (!user) throw new Error("No user")

      const { error } = await supabase.from("user_settings").update(updates).eq("user_id", user.id)

      if (error) throw error
      setSettings({ ...settings!, ...updates })
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, settings, isLoading, updateProfile, updateSettings }}>
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
