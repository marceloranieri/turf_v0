"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Heart, Calendar } from "lucide-react"
import { useSupabase } from "@/components/providers/SupabaseProvider"

type ArchivedMessage = {
  id: string
  title: string
  category: string
  engagement_score: number
  created_at: string
}

export default function ExplorePage() {
  const supabase = useSupabase()
  const [messages, setMessages] = useState<ArchivedMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadArchivedMessages() {
      try {
        const { data, error } = await supabase
          .rpc("get_yesterdays_top_messages")

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        console.error("Error loading archived messages:", err)
        setError(err instanceof Error ? err : new Error("Failed to load archived messages"))
      } finally {
        setLoading(false)
      }
    }

    loadArchivedMessages()
  }, [supabase])

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-violet-500" />
          <h1 className="text-2xl font-bold">Yesterday's Highlights</h1>
        </div>

        {loading ? (
          <div className="text-sm text-zinc-400 p-4">
            Loading archived messages...
          </div>
        ) : error ? (
          <div className="text-sm text-red-400 p-4">
            {error.message}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-zinc-400 p-4">
            No archived messages found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((message) => (
              <Card
                key={message.id}
                className="bg-zinc-800/50 border-zinc-700/50 p-4 hover:bg-zinc-800/70 transition-colors"
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
                <div className="mt-2 text-xs text-zinc-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
