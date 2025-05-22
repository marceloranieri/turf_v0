"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useAuth } from "@/context/auth-context"
import type { RealtimeChannel } from "@supabase/supabase-js"

type RealtimeContextType = {
  setupPostSubscription: (topicId: string, callback: (payload: any) => void) => () => void
  setupTypingIndicator: (topicId: string, callback: (payload: any) => void) => () => void
  setupNotificationSubscription: (callback: (payload: any) => void) => () => void
  setTypingStatus: (topicId: string, isTyping: boolean) => Promise<void>
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabaseClient()
  const { user } = useAuth()
  const [channels, setChannels] = useState<RealtimeChannel[]>([])

  // Clean up channels on unmount
  useEffect(() => {
    return () => {
      channels.forEach((channel) => {
        channel.unsubscribe()
      })
    }
  }, [channels])

  const setupPostSubscription = (topicId: string, callback: (payload: any) => void) => {
    // Subscribe to messages for this topic
    const channel = supabase
      .channel(`messages:topic=${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `topic_id=eq.${topicId}`,
        },
        callback,
      )
      .subscribe()

    setChannels((prev) => [...prev, channel])

    return () => {
      channel.unsubscribe()
      setChannels((prev) => prev.filter((c) => c !== channel))
    }
  }

  const setupTypingIndicator = (topicId: string, callback: (payload: any) => void) => {
    // Subscribe to typing indicators for this topic
    const channel = supabase
      .channel(`typing:topic=${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_indicators",
          filter: `topic_id=eq.${topicId}`,
        },
        callback,
      )
      .subscribe()

    setChannels((prev) => [...prev, channel])

    return () => {
      channel.unsubscribe()
      setChannels((prev) => prev.filter((c) => c !== channel))
    }
  }

  const setupNotificationSubscription = (callback: (payload: any) => void) => {
    if (!user) return () => {}

    // Subscribe to notifications for this user
    const channel = supabase
      .channel(`notifications:user=${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        callback,
      )
      .subscribe()

    setChannels((prev) => [...prev, channel])

    return () => {
      channel.unsubscribe()
      setChannels((prev) => prev.filter((c) => c !== channel))
    }
  }

  const setTypingStatus = async (topicId: string, isTyping: boolean) => {
    if (!user) return

    try {
      // Check if a record already exists
      const { data: existingRecord } = await supabase
        .from("typing_indicators")
        .select("*")
        .eq("user_id", user.id)
        .eq("topic_id", topicId)
        .single()

      if (existingRecord) {
        // Update existing record
        await supabase
          .from("typing_indicators")
          .update({ is_typing: isTyping, updated_at: new Date().toISOString() })
          .eq("id", existingRecord.id)
      } else if (isTyping) {
        // Only insert if typing (no need to insert a non-typing record)
        await supabase.from("typing_indicators").insert({
          user_id: user.id,
          topic_id: topicId,
          is_typing: true,
        })
      }
    } catch (error) {
      console.error("Error setting typing status:", error)
    }
  }

  const value = {
    setupPostSubscription,
    setupTypingIndicator,
    setupNotificationSubscription,
    setTypingStatus,
  }

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
