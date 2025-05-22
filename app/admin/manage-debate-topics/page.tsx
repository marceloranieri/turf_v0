"use client"

import { useState, useEffect } from "react"
import { RefreshCw, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react"

interface Topic {
  id: string
  title: string
  question: string
  category: string
  description: string | null
  last_shown: string | null
  times_shown: number
  is_active: boolean
}

interface DailyTopic {
  id: string
  topic_id: string
  date: string
  topic: Topic
}

export default function ManageDebateTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [dailyTopics, setDailyTopics] = useState<DailyTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [topicsRes, dailyTopicsRes] = await Promise.all([
        fetch("/api/topics"),
        fetch("/api/daily-topics")
      ])

      const [topicsData, dailyTopicsData] = await Promise.all([
        topicsRes.json(),
        dailyTopicsRes.json()
      ])

      if (topicsRes.ok) {
        setTopics(topicsData.data)
      }
      if (dailyTopicsRes.ok) {
        setDailyTopics(dailyTopicsData.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setMessage({
        text: "Failed to fetch data",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleGenerateTopics = async () => {
    try {
      setActionLoading(true)
      setMessage(null)

      const response = await fetch("/api/generate-daily-debate-topics", {
        method: "POST"
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          text: data.message,
          type: "success"
        })
        fetchData() // Refresh data
      } else {
        setMessage({
          text: data.error || "Failed to generate topics",
          type: "error"
        })
      }
    } catch (error) {
      setMessage({
        text: "An unexpected error occurred",
        type: "error"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleResetRotation = async () => {
    if (!confirm("Are you sure you want to reset the topic rotation? This will clear all topic history.")) {
      return
    }

    try {
      setActionLoading(true)
      setMessage(null)

      const response = await fetch("/api/reset-debate-topic-rotation", {
        method: "POST"
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          text: data.message,
          type: "success"
        })
        fetchData() // Refresh data
      } else {
        setMessage({
          text: data.error || "Failed to reset rotation",
          type: "error"
        })
      }
    } catch (error) {
      setMessage({
        text: "An unexpected error occurred",
        type: "error"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleActive = async (topicId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          is_active: !currentStatus
        })
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error toggling topic status:", error)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Debate Topics</h1>
          <div className="space-x-4">
            <button
              onClick={handleGenerateTopics}
              disabled={actionLoading}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Today's Topics
            </button>
            <button
              onClick={handleResetRotation}
              disabled={actionLoading}
              className="flex items-center px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Rotation
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md flex items-start space-x-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Today's Topics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Today's Topics</h2>
              <div className="bg-card rounded-lg shadow-sm border">
                {dailyTopics.length > 0 ? (
                  <div className="divide-y">
                    {dailyTopics.map((dailyTopic) => (
                      <div key={dailyTopic.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{dailyTopic.topic.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {dailyTopic.topic.question}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {dailyTopic.topic.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No topics selected for today
                  </div>
                )}
              </div>
            </div>

            {/* All Topics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">All Topics</h2>
              <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Times Shown</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Last Shown</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {topics.map((topic) => (
                        <tr key={topic.id}>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{topic.title}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {topic.question}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {topic.category}
                            </span>
                          </td>
                          <td className="px-4 py-3">{topic.times_shown}</td>
                          <td className="px-4 py-3">
                            {topic.last_shown
                              ? new Date(topic.last_shown).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleActive(topic.id, topic.is_active)}
                              className={`px-2 py-1 rounded text-xs ${
                                topic.is_active
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              }`}
                            >
                              {topic.is_active ? "Active" : "Inactive"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 