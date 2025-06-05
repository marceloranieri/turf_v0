"use client"

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import FeedCircleColumn from '@/components/dashboard/FeedCircleColumn'
import SuggestedCircles from '@/components/dashboard/SuggestedCircles'
import { getSession } from '@/lib/auth'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const [feedData, setFeedData] = useState([])

  const fetchFeed = async () => {
    const { data: userCircles } = await supabase
      .from('circle_members')
      .select('circle_id, circles ( topic_id, topics ( title, description ) )')

    if (!userCircles) return

    const circlesWithMessages = await Promise.all(
      userCircles.map(async (circle) => {
        const { data: messages } = await supabase
          .from('messages')
          .select('id, content, created_at, media_url, user_id')
          .eq('topic_id', circle.circles.topic_id)
          .order('created_at', { ascending: false })
          .limit(10)

        return {
          ...circle.circles.topics,
          circleId: circle.circle_id,
          messages,
        }
      })
    )

    setFeedData(circlesWithMessages)
  }

  useEffect(() => {
    fetchFeed()
    const interval = setInterval(fetchFeed, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex overflow-x-auto gap-6">
        {feedData.map((circle) => (
          <FeedCircleColumn key={circle.circleId} circle={circle} />
        ))}
      </div>
      <SuggestedCircles />
    </div>
  )
}
