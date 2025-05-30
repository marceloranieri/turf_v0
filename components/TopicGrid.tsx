'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCategory } from '@/lib/category-colors'
import { Users, MessageSquare } from 'lucide-react'

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
      {topics.map((topic, index) => {
        const categoryInfo = getCategory(topic.category)
        const Icon = categoryInfo.icon

        return (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="group"
          >
            <Card className="bg-zinc-800/50 border-zinc-700/50 p-4 md:p-5 hover:bg-zinc-800/70 transition-all duration-150 hover:shadow-lg hover:shadow-zinc-900/20">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${categoryInfo.bgColor} ${categoryInfo.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-white transition-colors">{topic.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 ${categoryInfo.bgColor} ${categoryInfo.color} ${categoryInfo.borderColor}`}
                      >
                        {categoryInfo.emoji} {topic.category}
                      </Badge>
                    </div>
                  </div>
                  {topic.active_users && topic.active_users > 10 && (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                      🔥 Trending
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {topic.description && (
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {topic.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      <Users className="w-4 h-4" />
                      <span>{topic.active_users || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.message_count || 0}</span>
                    </div>
                  </div>
                  <a
                    href={`/chat/${topic.id}`}
                    className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Join Circle →
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
