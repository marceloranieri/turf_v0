"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Sparkles, Filter } from "lucide-react"
import { useTopics } from "@/context/topics-context"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase"
import TopicCard from "./topic-card"

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

      // First try to get today's daily topics
      const today = new Date().toISOString().split("T")[0]
      const { data: dailyTopics, error: dailyError } = await supabase
        .from("daily_topics")
        .select(`
          topic_id,
          topic_text,
          date,
          topics (
            id,
            title,
            question,
            category,
            created_at,
            expires_at
          )
        `)
        .eq("date", today)

      if (dailyTopics && dailyTopics.length > 0) {
        // Use today's curated topics
        const todaysTopics = dailyTopics.map((dt) => dt.topics).filter(Boolean) as Topic[]
        setTopics(todaysTopics)
        setFilteredTopics(todaysTopics)
      } else {
        // Fallback to all topics if no daily topics found
        const topicsData = await fetchTopics()
        setTopics(topicsData)
        setFilteredTopics(topicsData)
      }

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

// Also export as default for backward compatibility
export default TopicFeed
