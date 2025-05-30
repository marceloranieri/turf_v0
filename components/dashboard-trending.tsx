"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, MessageSquare, Heart } from "lucide-react"
import { useSupabase } from "@/components/providers/SupabaseProvider"

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
      <div className="text-sm text-zinc-400 p-4">
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
        <h2 className="text-lg font-semibold">Trending</h2>
      </div>
      {messages.map((message) => (
        <Card
          key={message.id}
          className="bg-zinc-800/50 border-zinc-700/50 p-3 hover:bg-zinc-800/70 transition-colors"
        >
          <h3 className="font-medium text-sm mb-2">{message.title}</h3>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <Badge variant="outline" className="bg-zinc-800/80 text-zinc-300 border-zinc-700">
              {message.category}
            </Badge>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{message.engagement_score}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{message.engagement_score}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 