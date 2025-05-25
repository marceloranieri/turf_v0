'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Topic {
  id: string
  topic_id: string
  topic_text: string
  date: string
  created_at: string
}

export default function DailyTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchTodayTopics() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
          .from('daily_topics')
          .select('*')
          .eq('date', today)
          .order('created_at', { ascending: true })

        if (error) throw error

        if (!data || data.length === 0) {
          // If no topics for today, trigger generation
          const response = await fetch('/api/generate-daily-topics', {
            method: 'POST',
          })
          if (!response.ok) throw new Error('Failed to generate topics')
          
          const { data: newTopics } = await response.json()
          setTopics(newTopics)
        } else {
          setTopics(data)
        }
      } catch (err) {
        console.error('Error fetching topics:', err)
        setError('Failed to load today\'s topics')
      } finally {
        setLoading(false)
      }
    }

    fetchTodayTopics()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Today's Debate Topics</h2>
      <div className="grid gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <p className="text-gray-800">{topic.topic_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 