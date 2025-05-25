"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, MessageSquare, TrendingUp, Clock, MoreHorizontal, Settings } from "lucide-react"

export function MyCirclesView() {
  const [searchQuery, setSearchQuery] = useState("")

  const myCircles = [
    {
      id: 1,
      name: "Tech Innovators",
      description: "Discussing the latest in technology and innovation",
      members: 1234,
      activeNow: 45,
      lastActivity: "2 minutes ago",
      isOwner: true,
      avatar: "/placeholder.svg?height=40&width=40&text=TI",
      unreadCount: 3,
    },
    {
      id: 2,
      name: "Design Thinking",
      description: "UX/UI design principles and creative processes",
      members: 856,
      activeNow: 23,
      lastActivity: "15 minutes ago",
      isOwner: false,
      avatar: "/placeholder.svg?height=40&width=40&text=DT",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "Startup Founders",
      description: "Building and scaling successful startups",
      members: 2341,
      activeNow: 67,
      lastActivity: "1 hour ago",
      isOwner: false,
      avatar: "/placeholder.svg?height=40&width=40&text=SF",
      unreadCount: 12,
    },
  ]

  const suggestedCircles = [
    {
      id: 4,
      name: "AI & Machine Learning",
      description: "Exploring artificial intelligence and ML applications",
      members: 3456,
      avatar: "/placeholder.svg?height=40&width=40&text=AI",
    },
    {
      id: 5,
      name: "Remote Work Culture",
      description: "Best practices for distributed teams",
      members: 1789,
      avatar: "/placeholder.svg?height=40&width=40&text=RW",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Circles</h1>
          <p className="text-zinc-400 mt-1">Connect with communities that matter to you</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Circle
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search your circles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-800/50 border-zinc-700"
        />
      </div>

      <Tabs defaultValue="joined" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
          <TabsTrigger value="joined">Joined ({myCircles.length})</TabsTrigger>
          <TabsTrigger value="owned">Owned (1)</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="joined" className="space-y-4">
          {myCircles.map((circle) => (
            <Card key={circle.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={circle.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{circle.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{circle.name}</h3>
                        {circle.isOwner && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-violet-600/20 text-violet-400 border-violet-600/30"
                          >
                            Owner
                          </Badge>
                        )}
                        {circle.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">{circle.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm mt-1">{circle.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-zinc-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{circle.members.toLocaleString()} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span>{circle.activeNow} active now</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{circle.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="owned" className="space-y-4">
          {myCircles
            .filter((circle) => circle.isOwner)
            .map((circle) => (
              <Card key={circle.id} className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={circle.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{circle.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{circle.name}</h3>
                        <p className="text-zinc-400 text-sm mt-1">{circle.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-zinc-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{circle.members.toLocaleString()} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>+12% this week</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold mb-2">Suggested Circles</h3>
            <p className="text-zinc-400 text-sm">Based on your interests and activity</p>
          </div>
          {suggestedCircles.map((circle) => (
            <Card key={circle.id} className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={circle.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{circle.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{circle.name}</h3>
                      <p className="text-zinc-400 text-sm mt-1">{circle.description}</p>
                      <div className="flex items-center space-x-1 mt-3 text-xs text-zinc-500">
                        <Users className="h-3 w-3" />
                        <span>{circle.members.toLocaleString()} members</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Join Circle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
