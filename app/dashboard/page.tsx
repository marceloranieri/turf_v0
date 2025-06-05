"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { MessageCard } from '@/components/MessageCard'
import { getTopMessagesForCircle } from '@/lib/data/messages'
import SidebarNav from '@/components/SidebarNav'

const DashboardPage = () => {
  const [circles, setCircles] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchCircles = async () => {
      const { data } = await supabase
        .from('circle_members')
        .select('circle_id, circles(id, topic_id, topics(title, description))')

      setCircles(data || [])
    }
    fetchCircles()
  }, [])

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circle: any) => (
            <CircleFeed 
              key={circle.circle_id} 
              circleId={circle.circle_id}
              title={circle.circles.topics.title}
              description={circle.circles.topics.description}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

const CircleFeed = ({ 
  circleId, 
  title, 
  description 
}: { 
  circleId: string
  title: string
  description: string
}) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const loadMessages = async () => {
      const topMessages = await getTopMessagesForCircle(circleId)
      setMessages(topMessages || [])
    }
    loadMessages()
    const interval = setInterval(loadMessages, 30000)
    return () => clearInterval(interval)
  }, [circleId])

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No messages yet</p>
        ) : (
          messages.map((msg: any) => (
            <MessageCard key={msg.id} message={msg} />
          ))
        )}
      </div>
    </div>
  )
}

export default DashboardPage
