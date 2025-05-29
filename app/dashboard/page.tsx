"use client"

import { useEffect, useState } from 'react'
import { LeftSidebar } from "@/components/left-sidebar"
import TopicGrid from '@/components/TopicGrid'
import { Loader2 } from 'lucide-react'

interface Topic {
  id: string
  title: string
  category?: string
  created_at?: string
  description?: string
  active_users?: number
}

const CATEGORIES = ['All', 'Tech', 'Design', 'Lifestyle', 'Gaming'] as const
type Category = typeof CATEGORIES[number]

export default function DashboardPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')

  useEffect(() => {
    async function loadTopics() {
      try {
        console.log('Fetching topics...')
        const response = await fetch('/api/generate-daily-topics')
        if (!response.ok) {
          throw new Error('Failed to fetch topics')
        }
        const data = await response.json()
        console.log('Fetched topics:', data)
        setTopics(data)
      } catch (err) {
        console.error('Error loading topics:', err)
        setError(err instanceof Error ? err.message : 'Failed to load topics')
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [])

  const filteredTopics = selectedCategory === 'All'
    ? topics
    : topics.filter(topic => topic.category === selectedCategory)

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Today's Circles</h1>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedCategory === category
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">
            {error}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-zinc-500 text-center py-8">
            No topics available in this category.
          </div>
        ) : (
          <TopicGrid topics={filteredTopics} />
        )}
      </main>
    </div>
  )
}
