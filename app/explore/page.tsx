"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Calendar, Users, Flame, Copy, UserPlus, ExternalLink } from "lucide-react"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { TrendingCard } from "@/components/trending-card"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getCategory } from "@/lib/category-colors"

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

export default function ExplorePage() {
  const supabase = useSupabase()
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

  useEffect(() => {
    async function loadData() {
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

    loadData()
  }, [supabase])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You might want to add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-12">
        {/* Today's Circles Section */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <Users className="w-6 h-6 text-violet-500" />
            <h2 className="text-2xl font-bold tracking-tight">Today's Circles</h2>
          </motion.div>

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
              {activeTopics.map((topic, index) => {
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
        </section>

        {/* Yesterday's Hottest Circles Section */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <Calendar className="w-6 h-6 text-violet-500" />
            <h2 className="text-2xl font-bold tracking-tight">Yesterday's Hottest Circles</h2>
          </motion.div>

          {loading.archived ? (
            <div className="text-sm text-zinc-400 p-4 animate-pulse">
              Loading yesterday's highlights...
            </div>
          ) : yesterdaysTopics.length === 0 ? (
            <div className="text-sm text-zinc-500 italic p-4">
              No hot debates from yesterday — but today's are heating up!
            </div>
          ) : (
            <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {yesterdaysTopics.map((message, index) => (
                <TrendingCard
                  key={message.id}
                  {...message}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Suggested People Section */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <UserPlus className="w-6 h-6 text-violet-500" />
            <h2 className="text-2xl font-bold tracking-tight">Suggested People to Follow</h2>
          </motion.div>

          {loading.suggested ? (
            <div className="text-sm text-zinc-400 p-4 animate-pulse">
              Loading suggestions...
            </div>
          ) : suggestedUsers.length === 0 ? (
            <div className="text-sm text-zinc-500 italic p-4">
              We're still learning your taste — join more Circles to improve suggestions.
            </div>
          ) : (
            <div className="space-y-4">
              {suggestedUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-zinc-800 rounded-2xl p-4 hover:scale-[1.01] transition-transform duration-150"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.preferred_categories?.map((category) => {
                          const categoryInfo = getCategory(category)
                          return (
                            <Badge
                              key={category}
                              variant="outline"
                              className={`${categoryInfo.bgColor} ${categoryInfo.color} ${categoryInfo.borderColor}`}
                            >
                              {categoryInfo.emoji} {category}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/profile/${user.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
