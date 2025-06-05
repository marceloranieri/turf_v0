"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function DailyTopicsAdmin() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)
  const [todaysTopics, setTodaysTopics] = useState<any[]>([])
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const generateDailyTopics = async () => {
    setIsGenerating(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/generate-daily-topics", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate topics")
      }

      const result = await response.json()
      setStatus("success")
      setLastGenerated(new Date().toISOString())
      await fetchTodaysTopics()
    } catch (error) {
      console.error("Error generating topics:", error)
      setStatus("error")
    } finally {
      setIsGenerating(false)
    }
  }

  const fetchTodaysTopics = async () => {
    const today = new Date().toISOString().split("T")[0]
    const { data, error } = await supabase
      .from("daily_topics")
      .select(`
        *,
        topics (
          title,
          question,
          category
        )
      `)
      .eq("date", today)
      .order("created_at", { ascending: true })

    if (data) {
      setTodaysTopics(data)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Topics Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Generate Today's Topics</p>
              <p className="text-xs text-muted-foreground">Randomly selects 5 topics from the master pool</p>
            </div>
            <Button onClick={generateDailyTopics} disabled={isGenerating} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generating..." : "Generate Topics"}
            </Button>
          </div>

          {status === "success" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Topics generated successfully!</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Failed to generate topics. Please try again.</span>
            </div>
          )}

          {lastGenerated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last generated: {new Date(lastGenerated).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Topics ({todaysTopics.length}/5)</CardTitle>
        </CardHeader>
        <CardContent>
          {todaysTopics.length > 0 ? (
            <div className="space-y-3">
              {todaysTopics.map((dailyTopic, index) => (
                <div key={dailyTopic.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{dailyTopic.topics?.title}</h4>
                      <p className="text-sm text-muted-foreground">{dailyTopic.topics?.question}</p>
                    </div>
                    <Badge variant="outline">{dailyTopic.topics?.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No topics generated for today yet.</p>
              <Button variant="outline" onClick={fetchTodaysTopics} className="mt-2">
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
