"use client"

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Loader2 } from 'lucide-react'
import { TurfFinalDashboard } from '@/components/dashboard/TurfFinalDashboard'

export default function DashboardPage() {
  const supabase = useSupabase()
  const [joinedCircles, setJoinedCircles] = useState([])
  const [allCircles, setAllCircles] = useState([])
  const [messagesByCircle, setMessagesByCircle] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTab, setSelectedTab] = useState("feed") // feed | my | all

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await supabase.auth.getUser()
        const userId = user?.data?.user?.id
        if (!userId) throw new Error("User not authenticated")

        const [{ data: joined }, { data: dailyTopics }] = await Promise.all([
          supabase
            .from("circle_members")
            .select("circle_id")
            .eq("user_id", userId),

          supabase
            .from("daily_topics")
            .select("id, topic_id, created_at, topics (title, question, description)")
        ])

        const joinedIds = new Set((joined || []).map(j => j.circle_id))
        const joinedCircles = (dailyTopics || []).filter(c => joinedIds.has(c.id))
        const unjoinedCircles = (dailyTopics || []).filter(c => !joinedIds.has(c.id))

        const messagesMap = {}
        for (const c of joinedCircles) {
          const { data: messages } = await supabase
            .from("messages")
            .select("id, user_id, content, created_at, upvotes, media_url, media_type")
            .eq("circle_id", c.id)
            .order("upvotes", { ascending: false })
            .limit(10)
          messagesMap[c.id] = messages || []
        }

        setJoinedCircles(joinedCircles)
        setAllCircles(unjoinedCircles)
        setMessagesByCircle(messagesMap)
        setLoading(false)
      } catch (err) {
        console.error("Dashboard load error:", err)
        setError(err.message || "Unexpected error")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6" />
        <span>Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Error loading dashboard:</p>
        <pre className="text-xs bg-neutral-900 p-2 rounded mt-2">{error}</pre>
      </div>
    )
  }

  let visibleCircles = []
  if (selectedTab === "my") {
    visibleCircles = joinedCircles
  } else if (selectedTab === "all") {
    visibleCircles = [...joinedCircles, ...allCircles]
  } else {
    visibleCircles =
      joinedCircles.length > 0 ? [...joinedCircles, ...allCircles] : allCircles
  }

  return (
    <TurfFinalDashboard
      joinedCircles={joinedCircles}
      unjoinedCircles={allCircles}
      messagesByCircle={messagesByCircle}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      visibleCircles={visibleCircles}
    />
  )
}
