"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Calendar } from "lucide-react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { TrendingCard } from "@/components/trending-card"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { motion } from "framer-motion"

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
  const [parent] = useAutoAnimate()

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-6"
        >
          <Calendar className="w-6 h-6 text-violet-500" />
          <h1 className="text-2xl font-bold tracking-tight">Yesterday's Highlights</h1>
        </motion.div>

        {loading ? (
          <div className="text-sm text-zinc-400 p-4 animate-pulse">
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
          <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((message, index) => (
              <TrendingCard
                key={message.id}
                {...message}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
