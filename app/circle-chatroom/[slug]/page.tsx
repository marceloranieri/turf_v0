"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { CircleLayout } from "@/components/circle-layout"
import { CircleChatroom } from "@/components/circle-chatroom"

type Topic = {
  id: string
  title: string
  description: string
  slug: string
  created_at: string
  user_id: string
}

export default function CircleChatroomSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  const { supabase } = useAuth()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTopic() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .eq("slug", params.slug)
          .single()

        if (error) throw error
        setTopic(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load topic"))
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [supabase, params.slug])

  if (loading) {
    return (
      <CircleLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </CircleLayout>
    )
  }

  if (error || !topic) {
    return (
      <CircleLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Failed to load topic</p>
        </div>
      </CircleLayout>
    )
  }

  return (
    <CircleLayout>
      <CircleChatroom topic={topic} />
    </CircleLayout>
  )
} 