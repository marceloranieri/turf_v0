"use client"

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Loader2 } from 'lucide-react'
import { TurfFinalDashboard } from '@/components/dashboard/TurfFinalDashboard'

export default function DashboardPage() {
  const supabase = useSupabase()
  const [data, setData] = useState({
    circles: [],
    messages: {},
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = await supabase.auth.getUser()
        const userId = user?.data?.user?.id

        if (!userId) {
          setData({ ...data, loading: false, error: 'User not logged in' })
          return
        }

        const { data: joinedCircles, error: joinedError } = await supabase
          .from("circle_members")
          .select("circle_id, circles:circle_id(id, topic_id, created_at, topics(title, question, description))")
          .eq("user_id", userId)

        if (joinedError) throw new Error(joinedError.message)

        const messageMap = {}

        for (const c of joinedCircles || []) {
          const { data: messages, error: msgError } = await supabase
            .from("messages")
            .select("id, user_id, content, created_at, upvotes, media_url, media_type")
            .eq("circle_id", c.circle_id)
            .order("upvotes", { ascending: false })
            .limit(10)

          if (!msgError) {
            messageMap[c.circle_id] = messages || []
          }
        }

        setData({
          circles: joinedCircles,
          messages: messageMap,
          loading: false,
          error: null,
        })
      } catch (err) {
        setData({ ...data, loading: false, error: err.message })
      }
    }

    fetchDashboardData()
  }, [])

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Error loading dashboard: {data.error}</p>
      </div>
    )
  }

  return (
    <TurfFinalDashboard
      circles={data.circles}
      messagesByCircle={data.messages}
    />
  )
}
