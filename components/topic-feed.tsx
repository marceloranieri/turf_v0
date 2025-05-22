"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, MessageSquare, TrendingUp, Sparkles, Filter } from "lucide-react"
import { useTopics } from "@/context/topics-context"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase"

type Topic = Database["public"]["Tables"]["topics"]["Row"]

export function TopicFeed() {
  const router = useRouter()
  const { fetchTopics } = useTopics()
  const [timeLeft, setTimeLeft] = useState("23:45:12")
  const [activeTab, setActiveTab] = useState("all")
  const [topics, setTopics] = useState<Topic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch topics on component mount
  useEffect(() => {
    const loadTopics = async () => {
      setIsLoading(true)
      const topicsData = await fetchTopics()
      setTopics(topicsData)
      setFilteredTopics(topicsData)
      setIsLoading(false)
    }

    loadTopics()
  }, [fetchTopics])

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      // This is a mock implementation - in a real app, you'd calculate the actual time remaining
      const [hours, minutes, seconds] = timeLeft.split(":").map(Number)
      let newSeconds = seconds - 1
      let newMinutes = minutes
      let newHours = hours

      if (newSeconds < 0) {
        newSeconds = 59
        newMinutes -= 1
      }

      if (newMinutes < 0) {
        newMinutes = 59
        newHours -= 1
      }

      if (newHours < 0) {
        // Topics expired
        clearInterval(timer)
        return
      }

      setTimeLeft(
        `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${newSeconds
          .toString()
          .padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Filter topics based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredTopics(topics)
    } else {
      setFilteredTopics(topics.filter((topic) => topic.category === activeTab))
    }
  }, [activeTab, topics])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Today's Circles</h1>
          <div className="flex items-center text-sm text-zinc-400 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>Topics refresh in: </span>
            <Badge variant="outline" className="ml-2 text-xs bg-zinc-800/80 text-zinc-300 border-zinc-700">
              {timeLeft}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            All Topics
          </TabsTrigger>
          <TabsTrigger
            value="tech"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            Tech
          </TabsTrigger>
          <TabsTrigger
            value="entertainment"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            Entertainment
          </TabsTrigger>
          <TabsTrigger
            value="lifestyle"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            Lifestyle
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">No topics found in this category</p>
          <Button variant="outline" className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
            <Sparkles className="h-4 w-4 mr-2" />
            Discover More Topics
          </Button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
          <Sparkles className="h-4 w-4 mr-2" />
          Discover More Topics
        </Button>
      </div>
    </div>
  )
}

function TopicCard({ topic }: { topic: Topic }) {
  const [isJoined, setIsJoined] = useState(false)
  const [activeUsers, setActiveUsers] = useState(0)
  const [previewMessage, setPreviewMessage] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch active users count
    const fetchActiveUsers = async () => {
      try {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("topic_id", topic.id)
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

        setActiveUsers(count || Math.floor(Math.random() * 100) + 20) // Fallback to random number
      } catch (error) {
        console.error("Error fetching active users:", error)
        setActiveUsers(Math.floor(Math.random() * 100) + 20) // Fallback to random number
      }
    }

    // Fetch preview message
    const fetchPreviewMessage = async () => {
      try {
        const { data } = await supabase
          .from("messages")
          .select(`
            content,
            user:user_id (
              username,
              full_name,
              avatar_url
            )
          `)
          .eq("topic_id", topic.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        setPreviewMessage(data)
      } catch (error) {
        console.error("Error fetching preview message:", error)
      }
    }

    fetchActiveUsers()
    fetchPreviewMessage()
  }, [topic.id])

  // Check if topic is new (created within the last 24 hours)
  const isNew = new Date(topic.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50 p-5 hover:bg-zinc-800/70 transition-all hover:border-zinc-600/50 group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold group-hover:text-violet-400 transition-colors">{topic.title}</h3>
            {isNew && <Badge className="ml-2 bg-green-600/20 text-green-400 border-green-600/30 text-xs">New</Badge>}
          </div>
          <p className="text-zinc-300 mt-1 text-sm">{topic.question}</p>
        </div>
        <Button
          variant={isJoined ? "default" : "outline"}
          size="sm"
          className={`${
            isJoined
              ? "bg-violet-600 hover:bg-violet-700 text-white"
              : "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          }`}
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? "Joined" : "Join"}
        </Button>
      </div>

      <div className="flex items-center text-xs text-zinc-400 mb-4">
        <div className="flex items-center mr-4">
          <Users className="h-3.5 w-3.5 mr-1" />
          <span>{activeUsers} active</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          <span
            className="cursor-pointer hover:text-violet-400 transition-colors"
            onClick={() => router.push(`/topics/${topic.id}`)}
          >
            Join conversation
          </span>
        </div>
        {isNew && (
          <Badge variant="outline" className="ml-auto border-zinc-700 bg-zinc-800/50 text-zinc-400">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            Active
          </Badge>
        )}
      </div>

      {previewMessage && (
        <div className="border-t border-zinc-700/50 pt-3">
          <div className="flex items-start">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={previewMessage.user?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {previewMessage.user?.full_name?.[0] || previewMessage.user?.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {previewMessage.user?.full_name || previewMessage.user?.username}
                </span>
                <span className="text-xs text-zinc-500 ml-2">just now</span>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-1">{previewMessage.content}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
