"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, TrendingUp, Users } from "lucide-react"

const radarActivities = [
  {
    id: "1",
    type: "upvote",
    user: "john",
    others: 10,
    action: "upvoted your image",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    type: "reply",
    user: "julia",
    others: 5,
    action: 'replied to "I\'d love to see your..."',
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    type: "points",
    points: 5,
    action: 'for "we all do that to..." (fire comment)',
    time: "4 hours ago",
  },
  {
    id: "4",
    type: "join",
    user: "alex",
    action: "just joined this Circle",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    type: "top_video",
    user: "laura",
    points: 10,
    action: "for her video (top voted)",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function CircleRadar() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50">
        <h3 className="font-semibold text-sm">Live Activity</h3>
        <p className="text-xs text-zinc-500 mt-1">Real-time updates from this Circle</p>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {radarActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-3 group hover:bg-zinc-800/30 rounded-lg p-2 -m-2 transition-colors"
          >
            {/* Activity Icon/Avatar */}
            <div className="flex-shrink-0">
              {activity.avatar ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{activity.user?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-8 w-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                  {activity.type === "points" && <TrendingUp className="h-4 w-4 text-violet-400" />}
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
                    <span className="text-violet-400">@{activity.user}</span>
                    {activity.others && <span className="text-zinc-400"> and {activity.others} others</span>}
                    <span className="text-zinc-300"> {activity.action}</span>
                  </span>
                )}

                {activity.type === "reply" && (
                  <span>
                    <span className="text-violet-400">@{activity.user}</span>
                    {activity.others && <span className="text-zinc-400"> and {activity.others} others</span>}
                    <span className="text-zinc-300"> {activity.action}</span>
                  </span>
                )}

                {activity.type === "points" && (
                  <span>
                    <Badge variant="outline" className="bg-violet-600/20 text-violet-300 border-violet-500/30 mr-2">
                      +{activity.points} points
                    </Badge>
                    <span className="text-zinc-300">{activity.action}</span>
                  </span>
                )}

                {activity.type === "join" && (
                  <span>
                    <span className="text-zinc-300">Your friend </span>
                    <span className="text-violet-400">@{activity.user}</span>
                    <span className="text-zinc-300"> {activity.action}</span>
                  </span>
                )}

                {activity.type === "top_video" && (
                  <span>
                    <span className="text-violet-400">@{activity.user}</span>
                    <span className="text-zinc-300"> got </span>
                    <Badge variant="outline" className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30 mx-1">
                      +{activity.points}
                    </Badge>
                    <span className="text-zinc-300">{activity.action}</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-500 mt-1">{activity.time}</div>
            </div>

            {/* Online Indicator */}
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Users Count */}
      <div className="p-4 border-t border-zinc-800/50">
        <div className="flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-zinc-900">
                <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${i}`} />
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
