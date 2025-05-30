"use client"

import { useEffect, useState } from 'react'
import { LeftSidebar } from "@/components/left-sidebar"
import TopicGrid from '@/components/TopicGrid'
import CategoryTabs from '@/components/CategoryTabs'
import { Clock } from 'lucide-react'
import RightSuggestionsPane from '@/components/RightSuggestionsPane'
import { DashboardTrending } from '@/components/dashboard-trending'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { formatDistanceToNow } from 'date-fns'

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
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(REFRESH_INTERVAL)

  useEffect(() => {
    async function loadTopics() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        setTopics(data || [])
      } catch (err) {
        console.error('Error loading topics:', err)
        setError(err instanceof Error ? err.message : 'Failed to load topics')
      } finally {
        setLoading(false)
      }
    }

    loadTopics()

    // Set up refresh interval
    const interval = setInterval(() => {
      loadTopics()
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [supabase])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh(prev => {
        if (prev <= 0) return REFRESH_INTERVAL
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get unique categories from active topics
  const activeCategories = ['All', ...new Set(topics.map(t => t.category))]

  const filteredTopics = selectedCategory === 'All'
    ? topics
    : topics.filter(topic => topic.category === selectedCategory)

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white">
      <LeftSidebar />
      <div className="flex-1 p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-2xl font-bold tracking-tight">Today's Circles</h1>
          <div className="flex items-center gap-1 text-sm text-zinc-400 italic">
            <Clock size={16} className="text-zinc-500" />
            Next refresh in: {formatTimeRemaining(timeUntilRefresh)}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <CategoryTabs
              selected={selectedCategory}
              setSelected={setSelectedCategory}
              categories={activeCategories}
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
          </div>

          {/* Trending Sidebar */}
          <div className="lg:col-span-1">
            <DashboardTrending />
          </div>
        </div>
      </div>
      <RightSuggestionsPane />
    </div>
  )
}
