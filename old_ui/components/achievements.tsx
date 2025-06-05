"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

// Define achievement types
const ACHIEVEMENTS = [
  {
    id: "welcome",
    name: "Welcome Aboard",
    description: "Complete the onboarding process",
    icon: "🎉",
    maxProgress: 1,
  },
  {
    id: "first_post",
    name: "First Words",
    description: "Create your first post",
    icon: "✍️",
    maxProgress: 1,
  },
  {
    id: "conversation_starter",
    name: "Conversation Starter",
    description: "Create 5 posts",
    icon: "💬",
    maxProgress: 5,
  },
  {
    id: "popular_opinion",
    name: "Popular Opinion",
    description: "Receive 10 upvotes on your posts",
    icon: "👍",
    maxProgress: 10,
  },
  {
    id: "community_member",
    name: "Community Member",
    description: "Participate in 3 different topics",
    icon: "🌐",
    maxProgress: 3,
  },
]

export function Achievements() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return

      setLoading(true)

      try {
        // Fetch user achievements
        const { data: userAchievements, error } = await supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", user.id)

        if (error) throw error

        // Fetch user stats for calculating progress
        const stats = await fetchUserStats(user.id)

        // Combine achievements with progress
        const achievementsWithProgress = ACHIEVEMENTS.map((achievement) => {
          const userAchievement = userAchievements?.find((ua) => ua.achievement_id === achievement.id)

          let progress = 0
          let completed = false

          if (userAchievement) {
            progress = userAchievement.progress
            completed = userAchievement.completed
          } else {
            // Calculate progress based on stats
            switch (achievement.id) {
              case "welcome":
                progress = stats.onboardingCompleted ? 1 : 0
                completed = progress >= achievement.maxProgress
                break
              case "first_post":
                progress = stats.postCount > 0 ? 1 : 0
                completed = progress >= achievement.maxProgress
                break
              case "conversation_starter":
                progress = Math.min(stats.postCount, achievement.maxProgress)
                completed = progress >= achievement.maxProgress
                break
              case "popular_opinion":
                progress = Math.min(stats.upvotesReceived, achievement.maxProgress)
                completed = progress >= achievement.maxProgress
                break
              case "community_member":
                progress = Math.min(stats.topicsParticipated, achievement.maxProgress)
                completed = progress >= achievement.maxProgress
                break
            }
          }

          return {
            ...achievement,
            progress,
            completed,
          }
        })

        setAchievements(achievementsWithProgress)
      } catch (error) {
        console.error("Error fetching achievements:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchUserStats = async (userId: string) => {
      try {
        // Check if onboarding is completed
        const { data: settings } = await supabase
          .from("user_settings")
          .select("onboarding_completed")
          .eq("user_id", userId)
          .single()

        // Count user posts
        const { count: postCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        // Count upvotes received
        const { data: votes } = await supabase
          .from("votes")
          .select(`
            message_id,
            is_upvote,
            messages!inner(user_id)
          `)
          .eq("messages.user_id", userId)
          .eq("is_upvote", true)

        // Count unique topics participated in
        const { data: messages } = await supabase.from("messages").select("topic_id").eq("user_id", userId)

        const uniqueTopics = new Set(messages?.map((m) => m.topic_id) || [])

        return {
          onboardingCompleted: settings?.onboarding_completed || false,
          postCount: postCount || 0,
          upvotesReceived: votes?.length || 0,
          topicsParticipated: uniqueTopics.size,
        }
      } catch (error) {
        console.error("Error fetching user stats:", error)
        return {
          onboardingCompleted: false,
          postCount: 0,
          upvotesReceived: 0,
          topicsParticipated: 0,
        }
      }
    }

    fetchAchievements()
  }, [user])

  if (loading) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700/50">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Track your progress</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Track your progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <TooltipProvider key={achievement.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`p-4 rounded-lg border ${
                      achievement.completed ? "bg-violet-900/20 border-violet-500/50" : "bg-zinc-800 border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="text-2xl mr-3">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{achievement.name}</h3>
                          {achievement.completed && <Badge className="bg-violet-600">Completed</Badge>}
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">{achievement.description}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                            <span>Progress</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={(achievement.progress / achievement.maxProgress) * 100}
                            className="h-2 bg-zinc-700"
                            indicatorClassName={achievement.completed ? "bg-violet-500" : "bg-zinc-500"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{achievement.description}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {achievement.completed
                      ? "Completed!"
                      : `${achievement.progress}/${achievement.maxProgress} completed`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
