"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

export function TopicDiscovery() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("for-you")
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true)

      try {
        if (activeTab === "for-you" && user) {
          // Fetch user interests
          const { data: interests } = await supabase.from("user_interests").select("category").eq("user_id", user.id)

          const userInterests = interests?.map((i) => i.category) || []

          if (userInterests.length > 0) {
            // Fetch topics matching user interests
            const { data } = await supabase
              .from("topics")
              .select(`
                *,
                messages: messages(count)
              `)
              .in("category", userInterests)
              .order("created_at", { ascending: false })
              .limit(6)

            setTopics(data || [])
          } else {
            // Fallback to trending topics if no interests
            const { data } = await supabase
              .from("topics")
              .select(`
                *,
                messages: messages(count)
              `)
              .order("created_at", { ascending: false })
              .limit(6)

            setTopics(data || [])
          }
        } else if (activeTab === "trending") {
          // Fetch topics with most messages
          const { data } = await supabase
            .from("topics")
            .select(`
              *,
              messages: messages(count)
            `)
            .order("messages", { ascending: false })
            .limit(6)

          setTopics(data || [])
        } else if (activeTab === "new") {
          // Fetch newest topics
          const { data } = await supabase
            .from("topics")
            .select(`
              *,
              messages: messages(count)
            `)
            .order("created_at", { ascending: false })
            .limit(6)

          setTopics(data || [])
        }
      } catch (error) {
        console.error("Error fetching topics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [activeTab, user])

  const formatTimeLeft = (expiresAt: string) => {
    const expires = new Date(expiresAt)
    const now = new Date()
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m left`
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <CardTitle className="text-xl">Discover Topics</CardTitle>
        <CardDescription>Find conversations that match your interests</CardDescription>
      </CardHeader>

      <Tabs defaultValue="for-you" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="w-full bg-zinc-700/50 border border-zinc-600/50">
            <TabsTrigger value="for-you" className="flex-1 data-[state=active]:bg-violet-600">
              <Zap className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex-1 data-[state=active]:bg-violet-600">
            </TabsTrigger>
            <TabsTrigger value="new" className="flex-1 data-[state=active]:bg-violet-600">
              <Clock className="h-4 w-4 mr-2" />
              New
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">No topics found. Check back later!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-violet-500/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/topics/${topic.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600">{topic.category}</Badge>
                    <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeLeft(topic.expires_at)}
                    </Badge>
                  </div>

                  <h3 className="font-medium text-lg mb-1">{topic.title}</h3>
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{topic.question}</p>

                  <div className="flex items-center text-zinc-500 text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>
                      {topic.messages[0]?.count || 0} {topic.messages[0]?.count === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            variant="outline"
            className="w-full border-zinc-700 hover:bg-zinc-700"
            onClick={() => router.push("/topics")}
          >
            View All Topics
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  )
}
