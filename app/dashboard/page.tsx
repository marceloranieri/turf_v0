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
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { CirclesList } from "@/components/dashboard/circles-list"
import { RadarPanel } from "@/components/dashboard/radar-panel"

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
  const [radarFeed, setRadarFeed] = useState([])
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

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [{ data: topicsData, error: topicsError }, { data: radarData, error: radarError }] = await Promise.all([
          supabase
            .from("daily_topics")
            .select("id, title, description, category")
            .gte("created_at", startOfToday().toISOString())
            .lte("created_at", endOfToday().toISOString()),
          supabase
            .from("radar_feed")
            .select("*")
            .order("timestamp", { ascending: false })
            .limit(10)
        ])

        if (topicsError || radarError) {
          setError("Failed to load dashboard data")
        } else {
          setTopics(topicsData || [])
          setRadarFeed(radarData || [])
        }

        setNextRefreshAt(new Date(Date.now() + REFRESH_INTERVAL))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topics')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(() => {
      fetchData()
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

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <p className="text-red-500 text-center">{error}</p>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1 flex flex-col gap-6">
          <CirclesList topics={topics} />
        </div>
        <RadarPanel events={radarFeed} />
      </div>
    </DashboardShell>
  )
}
