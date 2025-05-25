"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import TopicCard from "./topic-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import type { Database } from "@/types/supabase"

type Topic = Database["public"]["Tables"]["topics"]["Row"]
type DailyTopic = Database["public"]["Tables"]["daily_topics"]["Row"]

const TopicFeed = () => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  const fetchTopics = async (): Promise<Topic[]> => {
    const { data, error } = await supabase.from("topics").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching topics:", error)
      return []
    }

    return data || []
  }

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
        const todaysTopics = dailyTopics.map((dt) => dt.topics).filter(Boolean)
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
  }, [supabase])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase()
    const newFilteredTopics = topics.filter(
      (topic) => topic.title.toLowerCase().includes(searchTerm) || topic.question.toLowerCase().includes(searchTerm),
    )
    setFilteredTopics(newFilteredTopics)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-5">Today's Topics</h1>
      <Input type="text" placeholder="Search topics..." onChange={handleSearch} className="mb-5" />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TopicFeed
