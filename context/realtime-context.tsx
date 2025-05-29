"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { useAuth } from "./auth-context"

type Presence = {
  user_id: string
  username: string
  last_seen: string
}

type RealtimeContextType = {
  presences: Presence[]
  loading: boolean
  error: Error | null
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user, supabase } = useAuth()
  const [presences, setPresences] = useState<Presence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setPresences([])
      setLoading(false)
      return
    }

    // Subscribe to presence changes
    const channel = supabase
      .channel("online_users")
      .on(
        "presence",
        { event: "sync" },
        () => {
          const newState = channel.presenceState()
          const presences = Object.values(newState).flat().map((presence: any) => ({
            user_id: presence.user_id,
            username: presence.username,
            last_seen: presence.last_seen,
          }))
          setPresences(presences)
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: user.id,
            username: user.email?.split("@")[0] || "anonymous",
            last_seen: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  return (
    <RealtimeContext.Provider value={{ presences, loading, error }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
