"use client"

import { useEffect, useState } from 'react'
import { LeftSidebar } from "@/components/left-sidebar"
import TopicGrid from '@/components/TopicGrid'
import CategoryTabs, { Category } from '@/components/CategoryTabs'
import RefreshTimer from '@/components/RefreshTimer'
import { Loader2 } from 'lucide-react'

interface Topic {
  id: string
  title: string
  category?: string
  created_at?: string
  description?: string
  active_users?: number
}

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export default function DashboardPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')

  useEffect(() => {
    async function loadTopics() {
      try {
        const cached = localStorage.getItem('turf_topics')
        const lastFetched = localStorage.getItem('turf_last_fetch')
        const now = Date.now()

        // Use cached data if it's less than 24 hours old
        if (cached && lastFetched && now - parseInt(lastFetched) < REFRESH_INTERVAL) {
          console.log('Using cached topics')
          setTopics(JSON.parse(cached))
          setLoading(false)
          return
        }

        console.log('Fetching fresh topics...')
        const response = await fetch('/api/generate-daily-topics')
        if (!response.ok) {
          throw new Error('Failed to fetch topics')
        }
        const data = await response.json()
        console.log('Fetched topics:', data)
        
        // Cache the new data
        localStorage.setItem('turf_topics', JSON.stringify(data))
        localStorage.setItem('turf_last_fetch', now.toString())
        
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
    : topics.filter(topic => topic.category?.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Today's Circles</h1>
          <RefreshTimer />
        </div>

        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

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
