import React from 'react'
import TopicCard from './TopicCard'

interface Topic {
  id: string
  title: string
  category?: string
  created_at?: string
  description?: string
  active_users?: number
}

export default function TopicGrid({ topics }: { topics: Topic[] }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  )
} 