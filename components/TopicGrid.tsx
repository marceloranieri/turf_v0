'use client'

import { motion } from 'framer-motion'
import TopicCard from './TopicCard'
import { useRouter } from 'next/navigation'

interface Topic {
  id: string
  title: string
  category: string
  created_at: string
  description?: string
  active_users?: number
  message_count?: number
}

interface TopicGridProps {
  topics: Topic[]
  loading?: boolean
}

function TopicSkeleton() {
  return (
    <div className="bg-zinc-800/50 rounded-2xl p-4 md:p-5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-700 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-zinc-700 rounded animate-pulse" />
              <div className="h-3 w-24 bg-zinc-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-6 w-20 bg-zinc-700 rounded-full animate-pulse" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-700 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-zinc-700 rounded animate-pulse" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-zinc-700 rounded animate-pulse" />
              <div className="h-4 w-8 bg-zinc-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-zinc-700 rounded animate-pulse" />
              <div className="h-4 w-8 bg-zinc-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-24 bg-zinc-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function TopicGrid({ topics, loading = false }: TopicGridProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TopicSkeleton />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <TopicCard
            title={topic.title}
            category={topic.category}
            userCount={topic.active_users || 0}
            onJoin={() => router.push(`/chat/${topic.id}`)}
            onCopyLink={() => navigator.clipboard.writeText(`${window.location.origin}/chat/${topic.id}`)}
          />
        </motion.div>
      ))}
    </div>
  )
}
