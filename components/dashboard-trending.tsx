"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { TrendingCard } from "@/components/trending-card"
import { useAutoAnimate } from "@formkit/auto-animate/react"

type TrendingMessage = {
  id: string
  title: string
  category: string
  engagement_score: number
}

export function DashboardTrending() {
  const supabase = useSupabase()
  const [messages, setMessages] = useState<TrendingMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [parent] = useAutoAnimate()

  useEffect(() => {
    async function loadTrendingMessages() {
      try {
        const { data, error } = await supabase
          .rpc("get_todays_top_live_messages")

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        console.error("Error loading trending messages:", err)
        setError(err instanceof Error ? err : new Error("Failed to load trending messages"))
      } finally {
        setLoading(false)
      }
    }

    loadTrendingMessages()
  }, [supabase])

  if (loading) {
    return (
      <div className="text-sm text-zinc-400 p-4 animate-pulse">
        Loading trending messages...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-400 p-4">
        {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-violet-500" />
        <h2 className="text-lg font-semibold tracking-tight">Trending</h2>
      </div>
      <div ref={parent} className="space-y-3">
        {messages.map((message, index) => (
          <TrendingCard
            key={message.id}
            {...message}
            index={index}
          />
        ))}
      </div>
    </div>
  )
} 