"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"

export function RightSidebar() {
  return (
    <div className="w-80 border-l border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80 p-4 overflow-y-auto">
      <Tabs defaultValue="trending">
        <TabsList className="w-full bg-zinc-800/50 mb-4">
          <TabsTrigger value="trending" className="flex-1">
            Trending topics
          </TabsTrigger>
          <TabsTrigger value="who-to-follow" className="flex-1">
            Who to follow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-3 mt-0">
          <TrendingTopic
            image="/placeholder.svg?height=60&width=60"
            title="AI Ethics in Modern Technology"
            time="4 hours ago"
            isNew={true}
            expiresIn="12:45:30"
          />

          <TrendingTopic
            image="/placeholder.svg?height=60&width=60"
            title="Global Climate Summit 2024"
            time="6 hours ago"
            isNew={true}
            expiresIn="14:22:15"
          />

          <TrendingTopic
            image="/placeholder.svg?height=60&width=60"
            title="Revolutionary Cancer Treatment Shows Promise"
            time="8 hours ago"
            isNew={true}
            expiresIn="16:10:05"
          />

          <TrendingTopic
            image="/placeholder.svg?height=60&width=60"
            title="Viral Social Media Challenge Raises Safety Concerns"
            time="10 hours ago"
            expiresIn="18:05:45"
          />

          <TrendingTopic
            image="/placeholder.svg?height=60&width=60"
            title="New Programming Language Gaining Popularity"
            time="12 hours ago"
            expiresIn="20:30:20"
          />
        </TabsContent>

        <TabsContent value="who-to-follow" className="space-y-3 mt-0">
          <UserToFollow name="Alex Chen" username="@alexchen" avatar="/placeholder.svg?height=40&width=40" />

          <UserToFollow name="Maya Johnson" username="@mayaj" avatar="/placeholder.svg?height=40&width=40" />

          <UserToFollow name="Sam Wilson" username="@samwilson" avatar="/placeholder.svg?height=40&width=40" />

          <UserToFollow name="Priya Patel" username="@priyap" avatar="/placeholder.svg?height=40&width=40" />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-zinc-400 mb-3">ACTIVE USERS</h3>
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar key={i} className="border-2 border-zinc-900 h-6 w-6">
                <AvatarImage src={`/placeholder-icon.png?height=24&width=24&text=${i}`} />
                <AvatarFallback>{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="ml-2 text-sm text-zinc-400">1,234+</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-zinc-400 mb-3">COMMUNITY STATS</h3>
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={<Users className="h-4 w-4" />} label="Members" value="12.5k" />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Active Topics" value="24" />
        </div>
      </div>
    </div>
  )
}

function TrendingTopic({
  image,
  title,
  time,
  isNew,
  expiresIn,
}: {
  image: string
  title: string
  time: string
  isNew?: boolean
  expiresIn: string
}) {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50 p-3 flex backdrop-blur-sm hover:bg-zinc-800/70 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className="mt-2 flex items-center">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="border-2 border-zinc-800 h-5 w-5">
                <AvatarImage src={`/text-holder.png?height=20&width=20&text=${i}`} />
                <AvatarFallback>{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="ml-2 text-xs text-zinc-400">{time}</span>
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-xs text-zinc-400">Expires in: </span>
          <Badge variant="outline" className="ml-1 text-xs bg-zinc-800/80 text-zinc-300 border-zinc-700">
            {expiresIn}
          </Badge>
        </div>
      </div>
      <div className="ml-3 relative">
        <div className="rounded-md w-16 h-16 overflow-hidden">
          <Image src={image || "/placeholder.svg"} alt={title} width={64} height={64} className="object-cover" />
        </div>
        {isNew && <div className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full"></div>}
      </div>
    </Card>
  )
}

function UserToFollow({
  name,
  username,
  avatar,
}: {
  name: string
  username: string
  avatar: string
}) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="flex items-center p-2 rounded-md hover:bg-zinc-800/50 transition-colors">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={avatar || "/placeholder.svg"} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-zinc-400 truncate">{username}</p>
      </div>
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        className={isFollowing ? "bg-transparent hover:bg-zinc-800" : ""}
        onClick={() => setIsFollowing(!isFollowing)}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50 p-3 flex flex-col items-center">
      <div className="flex items-center mb-1">
        {icon}
        <span className="ml-1 text-xs text-zinc-400">{label}</span>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </Card>
  )
}
