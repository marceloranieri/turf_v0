"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useAuth } from "./auth-context"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

type RealtimeContextType = {
  setupPostSubscription: (topicId: string, onPostUpdate: (payload: any) => void) => () => void
  setupTypingIndicator: (topicId: string, onTypingUpdate: (payload: any) => void) => () => void
  setupNotificationSubscription: (onNotification: (payload: any) => void) => () => void
  setTypingStatus: (topicId: string, isTyping: boolean) => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Set up typing status
  const setTypingStatus = async (topicId: string, isTyping: boolean) => {
    if (!user) return

    try {
      await supabase.from("typing_indicators").upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, topic_id" },
      )
    } catch (error) {
      console.error("Error setting typing status:", error)
    }
  }

  // Set up post subscription
  const setupPostSubscription = (topicId: string, onPostUpdate: (payload: any) => void) => {
    const channel = supabase
      .channel(`topic:${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `topic_id=eq.${topicId}`,
        },
        (payload) => {
          onPostUpdate(payload)
        },
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          console.error("Failed to subscribe to post updates")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }

  // Set up typing indicator subscription
  const setupTypingIndicator = (topicId: string, onTypingUpdate: (payload: any) => void) => {
    const channel = supabase
      .channel(`typing:${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_indicators",
          filter: `topic_id=eq.${topicId}`,
        },
        (payload) => {
          onTypingUpdate(payload)
        },
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          console.error("Failed to subscribe to typing indicators")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }

  // Set up notification subscription
  const setupNotificationSubscription = (onNotification: (payload: any) => void) => {
    if (!user) return () => {}

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          onNotification(payload)
          toast({
            title: "New notification",
            description: payload.new.content,
          })
        },
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          console.error("Failed to subscribe to notifications")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }

  return (
    <RealtimeContext.Provider
      value={{
        setupPostSubscription,
        setupTypingIndicator,
        setupNotificationSubscription,
        setTypingStatus,
      }}
    >
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
