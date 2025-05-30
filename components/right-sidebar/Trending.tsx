"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"
import { createBrowserSupabaseClient } from "@supabase/ssr"

type TrendingMessage = {
  id: string
  title: string
  category: string
  engagement_score: number
}

export default function Trending() {
  const [messages, setMessages] = useState<TrendingMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    const fetchTrending = async () => {
      const { data, error } = await supabase.rpc("get_todays_top_live_messages")
      if (!error && data) {
        setMessages(data)
      }
      setLoading(false)
    }

    fetchTrending()
  }, [])

  if (loading) return null
  if (!messages.length) return <p className="text-zinc-500 text-sm italic">No trending messages yet.</p>

  return (
    <div className="space-y-4">
      <h3 className="text-white text-sm font-semibold">Trending</h3>
      {messages.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <p className="text-white text-sm line-clamp-2">{item.title}</p>
          <div className="flex justify-between mt-2 text-xs text-zinc-400">
            <span>{item.category}</span>
            <div className="flex items-center gap-1 text-orange-400">
              <Flame size={14} />
              {item.engagement_score}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 