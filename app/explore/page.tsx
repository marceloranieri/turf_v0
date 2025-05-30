"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Calendar, Users, Flame, Copy, UserPlus, ExternalLink, Check } from "lucide-react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { TrendingCard } from "@/components/trending-card"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getCategory } from "@/lib/category-colors"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Timer from '@/components/Timer'
import dynamic from 'next/dynamic'
import ErrorBoundary from '@/components/ErrorBoundary'

// Dynamically import RightSidebar with SSR disabled
const RightSidebar = dynamic(() => import('@/components/right-sidebar'), { ssr: false })

type Topic = {
  id: string
  title: string
  category: string
  created_at: string
  active_users?: number
}

type ArchivedMessage = {
  id: string
  title: string
  category: string
  engagement_score: number
  created_at: string
  preview?: string
  author?: {
    id: string
    name: string
    avatar_url?: string
  }
}

type SuggestedUser = {
  id: string
  name: string
  avatar_url?: string
  preferred_categories: string[]
}

function SuggestedUserSkeleton() {
  return (
    <div className="flex items-center justify-between bg-zinc-800 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-700 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-zinc-700 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-zinc-700 rounded-full animate-pulse" />
            <div className="h-5 w-20 bg-zinc-700 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-zinc-700 rounded animate-pulse" />
        <div className="h-8 w-8 bg-zinc-700 rounded animate-pulse" />
      </div>
    </div>
  )
}

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export default function ExplorePage() {
  const supabase = useSupabase()
  const { toast } = useToast()
  const [activeTopics, setActiveTopics] = useState<Topic[]>([])
  const [yesterdaysTopics, setYesterdaysTopics] = useState<ArchivedMessage[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [mostActiveTopic, setMostActiveTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState({
    active: true,
    archived: true,
    suggested: true
  })
  const [error, setError] = useState<Error | null>(null)
  const [parent] = useAutoAnimate()
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [nextRefreshAt, setNextRefreshAt] = useState(new Date(Date.now() + REFRESH_INTERVAL))
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load topics after mounting
  useEffect(() => {
    if (!mounted || !supabase) return

    async function loadTopics() {
      try {
        // Load active topics
        const { data: topics, error: topicsError } = await supabase
          .from("topics")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (topicsError) throw topicsError
        setActiveTopics(topics || [])
        setLoading(prev => ({ ...prev, active: false }))
        setNextRefreshAt(new Date(Date.now() + REFRESH_INTERVAL))

        // Load yesterday's hottest messages
        const { data: archived, error: archivedError } = await supabase
          .rpc("get_yesterdays_hottest_messages")

        if (archivedError) throw archivedError
        setYesterdaysTopics(archived || [])
        setLoading(prev => ({ ...prev, archived: false }))

        // Load most active topic
        const { data: mostActive, error: mostActiveError } = await supabase
          .rpc("get_currently_most_active_circle")

        if (mostActiveError) throw mostActiveError
        setMostActiveTopic(mostActive?.[0] || null)

        // Load suggested users
        const { data: users, error: usersError } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", supabase.auth.getUser()?.data?.user?.id)
          .limit(5)

        if (usersError) throw usersError
        setSuggestedUsers(users || [])
        setLoading(prev => ({ ...prev, suggested: false }))

      } catch (err) {
        console.error("Error loading data:", err)
        setError(err instanceof Error ? err : new Error("Failed to load data"))
      }
    }

    loadTopics()

    // Set up refresh interval
    const interval = setInterval(() => {
      loadTopics()
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [supabase, mounted])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Link copied!",
        description: "Share this circle with your friends",
        duration: 2000,
      })
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const toggleFollow = async (userId: string) => {
    try {
      const isFollowing = following.has(userId)
      const { error } = await supabase
        .from("follows")
        .upsert({
          follower_id: supabase.auth.getUser()?.data?.user?.id,
          following_id: userId,
          created_at: new Date().toISOString(),
        }, {
          onConflict: "follower_id,following_id"
        })

      if (error) throw error

      setFollowing(prev => {
        const next = new Set(prev)
        if (isFollowing) {
          next.delete(userId)
        } else {
          next.add(userId)
        }
        return next
      })

      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? "You've unfollowed this user" : "You're now following this user",
        duration: 2000,
      })
    } catch (err) {
      console.error("Failed to toggle follow:", err)
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  // Get unique categories from active topics
  const activeCategories = ['All', ...new Set(activeTopics.map(t => t.category))]

  const filteredTopics = selectedCategory === 'All'
    ? activeTopics
    : activeTopics.filter(topic => topic.category === selectedCategory)

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
            <h1 className="text-2xl font-bold tracking-tight">Explore Circles</h1>
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
              {loading.active ? (
                <div className="text-sm text-zinc-400 p-4 animate-pulse">
                  Loading active circles...
                </div>
              ) : activeTopics.length === 0 ? (
                <div className="text-sm text-zinc-500 italic p-4">
                  No active circles at the moment — be the first to start one!
                </div>
              ) : (
                <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTopics.map((topic, index) => {
                    const categoryInfo = getCategory(topic.category)
                    const isMostActive = mostActiveTopic?.id === topic.id

                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-zinc-800 rounded-2xl p-4 hover:scale-[1.01] transition-transform duration-150"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${categoryInfo.bgColor} ${categoryInfo.color}`}>
                              {categoryInfo.icon && <categoryInfo.icon className="w-4 h-4" />}
                            </div>
                            <h3 className="font-medium">{topic.title}</h3>
                          </div>
                          {isMostActive && (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                              <Flame className="w-3 h-3 mr-1" />
                              Most Active Now
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${categoryInfo.bgColor} ${categoryInfo.color} ${categoryInfo.borderColor}`}>
                              {categoryInfo.emoji} {topic.category}
                            </Badge>
                            {topic.active_users && (
                              <span className="text-sm text-zinc-400">
                                {topic.active_users} active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`${window.location.origin}/chat/${topic.id}`)}
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy Link
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              asChild
                            >
                              <a href={`/chat/${topic.id}`}>
                                Join Circle
                              </a>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
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
