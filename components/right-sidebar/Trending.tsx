"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { Flame } from "lucide-react"
import { motion } from "framer-motion"

type TrendingMessage = {
  id: string
  title: string
  category: string
  engagement_score: number
}

export default function Trending() {
  const supabase = useSupabase()
  const [messages, setMessages] = useState<TrendingMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !supabase) return

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase.rpc("get_todays_top_live_messages")
        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        console.error("Error loading trending messages:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [supabase, mounted])

  if (!mounted) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-zinc-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-zinc-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (!messages.length) {
    return (
      <p className="text-zinc-500 text-sm italic">
        No trending messages yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-zinc-800 p-3 rounded-xl hover:bg-zinc-700 hover:scale-[1.01] transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium line-clamp-2">
                {message.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-400">{message.category}</span>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Flame size={12} className="text-orange-500" />
                  {message.engagement_score}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 