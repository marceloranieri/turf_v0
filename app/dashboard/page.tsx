"use client"

import { useEffect, useState } from 'react'
import { LeftSidebar } from "@/components/left-sidebar"
import TopicGrid from '@/components/TopicGrid'
import CategoryTabs from '@/components/CategoryTabs'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import Timer from '@/components/Timer'
import dynamic from 'next/dynamic'
import ErrorBoundary from '@/components/ErrorBoundary'
import { startOfToday, endOfToday } from 'date-fns'

// Dynamically import RightSidebar with SSR disabled
const RightSidebar = dynamic(() => import('@/components/right-sidebar'), { ssr: false })

interface Topic {
  id: string
  title: string
  category: string
  created_at: string
  description?: string
  active_users?: number
  message_count?: number
}

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export default function DashboardPage() {
  const supabase = useSupabase()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [nextRefreshAt, setNextRefreshAt] = useState(new Date(Date.now() + REFRESH_INTERVAL))
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load today's circles from daily_topics (joined with topics)
  useEffect(() => {
    if (!mounted || !supabase) return

    async function loadTopics() {
      setLoading(true)
      setError(null)
      try {
        // Get today's date in UTC
        const today = new Date()
        const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0))
        const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59))
        // Query daily_topics for today, join with topics
        const { data, error } = await supabase
          .from('daily_topics')
          .select('topic_id, topics(*), active_users, message_count, created_at')
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString())
          .order('created_at', { ascending: false })

        if (error) throw error
        // Map to Topic[]
        const mapped: Topic[] = (data || []).map((row: any) => ({
          id: row.topics.id,
          title: row.topics.title,
          category: row.topics.category,
          created_at: row.topics.created_at,
          description: row.topics.description,
          active_users: row.active_users,
          message_count: row.message_count
        }))
        setTopics(mapped)
        setNextRefreshAt(new Date(Date.now() + REFRESH_INTERVAL))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topics')
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
    const interval = setInterval(() => {
      loadTopics()
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [supabase, mounted])

  // Get unique categories from active topics
  const activeCategories = ['All', ...Array.from(new Set(topics.map(t => t.category)))]

  const filteredTopics = selectedCategory === 'All'
    ? topics
    : topics.filter(topic => topic.category === selectedCategory)

  // Return null during SSR to prevent hydration mismatches
  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white">
      <ErrorBoundary>
        <LeftSidebar />
      </ErrorBoundary>
      <div className="flex-1 p-8">
        <ErrorBoundary>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-6"
          >
            <h1 className="text-2xl font-bold tracking-tight">Today's Circles</h1>
            <Timer 
              nextRefreshAt={nextRefreshAt}
              size="sm"
              variant="subtle"
              pulseOnEnd
            />
          </motion.div>
        </ErrorBoundary>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ErrorBoundary>
              <CategoryTabs
                selected={selectedCategory}
                setSelected={setSelectedCategory}
                categories={activeCategories}
              />
            </ErrorBoundary>

            {/* Content Area */}
            <ErrorBoundary>
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
                <TopicGrid topics={filteredTopics} loading={loading} />
              )}
            </ErrorBoundary>
          </div>

          {/* Right Sidebar */}
          <ErrorBoundary>
            <RightSidebar nextRefreshAt={nextRefreshAt} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
