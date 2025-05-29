"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { useAuth } from "./auth-context"

type Topic = {
  id: string
  title: string
  description: string
  created_at: string
  user_id: string
}

type TopicsContextType = {
  topics: Topic[]
  loading: boolean
  error: Error | null
  createTopic: (title: string, description: string) => Promise<void>
  deleteTopic: (id: string) => Promise<void>
}

const TopicsContext = createContext<TopicsContextType | undefined>(undefined)

export function TopicsProvider({ children }: { children: React.ReactNode }) {
  const { user, supabase } = useAuth()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setTopics([])
      setLoading(false)
      return
    }

    async function loadTopics() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setTopics(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load topics"))
      } finally {
        setLoading(false)
      }
    }

    loadTopics()

    // Subscribe to changes
    const channel = supabase
      .channel("topics_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "topics",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTopics((prev) => [payload.new as Topic, ...prev])
          } else if (payload.eventType === "DELETE") {
            setTopics((prev) => prev.filter((t) => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  const createTopic = async (title: string, description: string) => {
    if (!user) throw new Error("No user logged in")

    try {
      const { error } = await supabase.from("topics").insert({
        title,
        description,
        user_id: user.id,
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create topic"))
      throw err
    }
  }

  const deleteTopic = async (id: string) => {
    if (!user) throw new Error("No user logged in")

    try {
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete topic"))
      throw err
    }
  }

  return (
    <TopicsContext.Provider
      value={{ topics, loading, error, createTopic, deleteTopic }}
    >
      {children}
    </TopicsContext.Provider>
  )
}

export function useTopics() {
  const context = useContext(TopicsContext)
  if (context === undefined) {
    throw new Error("useTopics must be used within a TopicsProvider")
  }
  return context
} 