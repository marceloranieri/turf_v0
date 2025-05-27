"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Users, Zap, ArrowDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Sample radar activities - in a real app, this would come from an API
const initialActivities = [
  {
    id: "1",
    type: "upvote",
    user: "john",
    others: 10,
    action: "upvoted your image",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    isNew: false,
  },
  {
    id: "2",
    type: "reply",
    user: "julia",
    others: 5,
    action: 'replied to "I\'d love to see your..."',
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    isNew: false,
  },
  {
    id: "3",
    type: "points_gain",
    points: 5,
    action: 'for "we all do that to..." (fire comment)',
    time: "4 hours ago",
    isNew: false,
  },
  {
    id: "4",
    type: "join",
    user: "alex",
    action: "just joined this Circle",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    isNew: false,
  },
  {
    id: "5",
    type: "points_loss",
    points: 3,
    action: "for inactive participation",
    time: "4 hours ago",
    isNew: false,
  },
]

// Demo function to add new notifications periodically
const demoNotifications = [
  {
    id: "new-1",
    type: "upvote",
    user: "sarah",
    action: "upvoted your comment",
    time: "Just now",
    avatar: "/placeholder.svg?height=32&width=32&text=S",
  },
  {
    id: "new-2",
    type: "points_gain",
    points: 10,
    action: "for your helpful response",
    time: "Just now",
  },
  {
    id: "new-3",
    type: "reply",
    user: "mike",
    action: 'replied to your message "That\'s interesting..."',
    time: "Just now",
    avatar: "/placeholder.svg?height=32&width=32&text=M",
  },
  {
    id: "new-4",
    type: "points_loss",
    points: 2,
    action: "for off-topic comment",
    time: "Just now",
  },
]

export function CircleRadar() {
  const [activities, setActivities] = useState(initialActivities)
  const [newNotificationCount, setNewNotificationCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Demo function to add new notifications periodically
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up a new interval
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * demoNotifications.length)
      const newNotification = {
        ...demoNotifications[randomIndex],
        id: `${demoNotifications[randomIndex].id}-${Date.now()}`,
        isNew: true,
      }

      setActivities((prev) => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 notifications
      setNewNotificationCount((prev) => prev + 1)

      // After 6 seconds, mark the notification as not new
      setTimeout(() => {
        setActivities((prev) =>
          prev.map((activity) => {
            if (activity.id === newNotification.id) {
              return { ...activity, isNew: false }
            }
            return activity
          }),
        )
      }, 6000)
    }, 15000) // Add a new notification every 15 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Live Activity</h3>
          {newNotificationCount > 0 && (
            <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-500/30 text-xs">
              {newNotificationCount} new
            </Badge>
          )}
        </div>
        <p className="text-xs text-zinc-500 mt-1">Real-time updates from this Circle</p>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="flex gap-3 group hover:bg-zinc-800/30 rounded-xl p-3 bg-zinc-800/10 border border-zinc-700/20 transition-colors">
                {/* Activity Icon/Avatar */}
                <div className="flex-shrink-0">
                  {activity.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{activity.user?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      {activity.type === "points_gain" && <Zap className="h-4 w-4 text-green-400" />}
                      {activity.type === "points_loss" && <ArrowDown className="h-4 w-4 text-red-400" />}
                      {activity.type === "upvote" && <Heart className="h-4 w-4 text-red-400" />}
                      {activity.type === "reply" && <MessageCircle className="h-4 w-4 text-blue-400" />}
                      {activity.type === "join" && <Users className="h-4 w-4 text-green-400" />}
                    </div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    {activity.type === "upvote" && (
                      <span>
                        <span className="text-violet-400 text-[13px] font-medium">@{activity.user}</span>
                        {activity.others && (
                          <span className="text-zinc-400 text-[13px]"> and {activity.others} others</span>
                        )}
                        <span className="text-zinc-300 text-[13px]"> {activity.action}</span>
                      </span>
                    )}

                    {activity.type === "reply" && (
                      <span>
                        <span className="text-violet-400 text-[13px] font-medium">@{activity.user}</span>
                        {activity.others && (
                          <span className="text-zinc-400 text-[13px]"> and {activity.others} others</span>
                        )}
                        <span className="text-zinc-300 text-[13px]"> {activity.action}</span>
                      </span>
                    )}

                    {activity.type === "points_gain" && (
                      <span>
                        <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-500/30 mr-2">
                          +{activity.points} points
                        </Badge>
                        <span className="text-zinc-300 text-[13px]">{activity.action}</span>
                      </span>
                    )}

                    {activity.type === "points_loss" && (
                      <span>
                        <Badge variant="outline" className="bg-red-600/20 text-red-300 border-red-500/30 mr-2">
                          -{activity.points} points
                        </Badge>
                        <span className="text-zinc-300 text-[13px]">{activity.action}</span>
                      </span>
                    )}

                    {activity.type === "join" && (
                      <span>
                        <span className="text-zinc-300 text-[13px]">Your friend </span>
                        <span className="text-violet-400 text-[13px] font-medium">@{activity.user}</span>
                        <span className="text-zinc-300 text-[13px]"> {activity.action}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-zinc-500 mt-1">{activity.time}</div>
                </div>

                {/* New Notification Indicator */}
                {activity.isNew && (
                  <div className="flex-shrink-0">
                    <motion.div
                      className="h-2 w-2 bg-green-500 rounded-full"
                      animate={{
                        opacity: [1, 0.5, 1],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        repeat: 3,
                        duration: 2,
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Active Users Count */}
      <div className="p-4 border-t border-zinc-800/50">
        <div className="flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-zinc-900">
                <AvatarImage src={`/placeholder-5twnv.png?key=ricye&height=24&width=24&text=${i}`} />
                <AvatarFallback className="text-xs">{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-500/30">
            850+ active
          </Badge>
        </div>
      </div>
    </div>
  )
}
