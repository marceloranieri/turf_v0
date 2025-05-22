"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

interface Topic {
  id: string
  title: string
  question: string
  category: string
  description: string | null
  last_shown: string | null
  times_shown: number
}

interface DailyTopic {
  id: string
  topic_id: string
  date: string
  topic: Topic
}

const categoryColors = {
  "Politics": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Technology": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  "Society": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Ethics": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  "Science": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  "Culture": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
  "default": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
}

export default function DailyDebateTopics() {
  const [topics, setTopics] = useState<DailyTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTopics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/daily-topics")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch topics")
      }

      if (!data.data || data.data.length === 0) {
        // If no topics exist for today, trigger generation
        const generateResponse = await fetch("/api/generate-daily-debate-topics", {
          method: "POST"
        })
        const generateData = await generateResponse.json()

        if (!generateResponse.ok) {
          throw new Error(generateData.error || "Failed to generate topics")
        }

        // Fetch the newly generated topics
        const newResponse = await fetch("/api/daily-topics")
        const newData = await newResponse.json()

        if (!newResponse.ok) {
          throw new Error(newData.error || "Failed to fetch generated topics")
        }

        setTopics(newData.data)
      } else {
        setTopics(data.data)
      }
    } catch (err) {
      console.error("Error fetching topics:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading topics: {error}</p>
        <button
          onClick={fetchTopics}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!topics.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No topics available for today</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((dailyTopic, index) => (
        <motion.div
          key={dailyTopic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg">{dailyTopic.topic.title}</h3>
              <span className={`text-xs px-2 py-1 rounded ${
                categoryColors[dailyTopic.topic.category as keyof typeof categoryColors] || categoryColors.default
              }`}>
                {dailyTopic.topic.category}
              </span>
            </div>
            
            <p className="text-muted-foreground line-clamp-3">
              {dailyTopic.topic.question}
            </p>

            <Link
              href={`/topics/${dailyTopic.topic.id}`}
              className="inline-flex items-center text-sm text-primary hover:text-primary/90"
            >
              View Full Topic
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 