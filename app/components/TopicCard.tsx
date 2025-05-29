import React from 'react'
import { TrendingUp, Users } from 'lucide-react'

interface Topic {
  id: string
  title: string
  category?: string
  created_at?: string
  description?: string
  active_users?: number
}

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <div
      data-testid="topic-card"
      className="group bg-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/70 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 ease-in-out"
    >
      {/* Placeholder image with gradient */}
      <div className="h-32 w-full rounded-lg bg-gradient-to-br from-violet-500/20 to-zinc-700/50 mb-4 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-violet-500/10 to-transparent animate-pulse" />
      </div>

      {/* Title + Description */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
        {topic.title}
      </h3>
      <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
        {topic.description || 'Join the conversation and share your thoughts...'}
      </p>

      {/* Category + Meta */}
      <div className="flex justify-between items-center text-xs">
        <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded-full">
          {topic.category || 'General'}
        </span>
        <div className="flex items-center gap-2 text-zinc-400">
          <Users className="w-4 h-4" />
          <span>{topic.active_users || 0} active</span>
        </div>
      </div>
    </div>
  )
} 