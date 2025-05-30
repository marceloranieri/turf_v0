"use client"

import { motion } from 'framer-motion'
import TrendingMessageItem from './TrendingMessageItem'

interface TrendingMessage {
  id: string
  title: string
  category: string
  engagement_score: number
}

export function DashboardTrending() {
  // This would be replaced with real data from your API
  const trendingMessages: TrendingMessage[] = [
    {
      id: '1',
      title: 'The future of AI in healthcare',
      category: 'Technology',
      engagement_score: 95
    },
    {
      id: '2',
      title: 'Sustainable living tips for urban dwellers',
      category: 'Lifestyle',
      engagement_score: 88
    },
    {
      id: '3',
      title: 'Latest developments in quantum computing',
      category: 'Science',
      engagement_score: 82
    }
  ]

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-4">Trending Now</h2>
      <div className="space-y-3">
        {trendingMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TrendingMessageItem
              message={message.title}
              category={message.category}
              engagementScore={message.engagement_score}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 