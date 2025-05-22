"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

export function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("reports")
  const [reports, setReports] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      try {
        // Check if user is admin
        const { data, error } = await supabase.from("admin_users").select("*").eq("user_id", user.id).single()

        if (error || !data) {
          // Not an admin, redirect to dashboard
          toast({
            title: "Access denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setIsAdmin(true)
        fetchData()
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/dashboard")
      }
    }

    checkAdminStatus()
  }, [user, router, toast])

  const fetchData = async () => {
    setLoading(true)

    try {
      if (activeTab === "reports") {
        // Fetch reports
        const { data, error } = await supabase
          .from("reports")
          .select(`
            *,
            reporter:reporter_id(username, avatar_url)
          `)
          .order("created_at", { ascending: false })

        if (error) throw error
        setReports(data || [])
      } else if (activeTab === "users") {
        // Fetch users
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error
        setUsers(data || [])
      } else if (activeTab === "topics") {
        // Fetch topics
        const { data, error } = await supabase
          .from("topics")
          .select(`
            *,
            creator:created_by(username, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error
        setTopics(data || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [activeTab, isAdmin])

  const handleReportAction = async (reportId: string, action: "approve" | "reject") => {
    try {
      // Update report status
      const { error } = await supabase
        .from("reports")
        .update({
          status: action === "approve" ? "approved" : "rejected",
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id,
        })
        .eq("id", reportId)

      if (error) throw error

      // Refresh reports
      fetchData()

      toast({
        title: `Report ${action === "approve" ? "approved" : "rejected"}`,
        description: `The report has been ${action === "approve" ? "approved" : "rejected"} successfully`,
      })
    } catch (error) {
      console.error(`Error ${action}ing report:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} report`,
        variant: "destructive",
      })
    }
  }

  const handleUserAction = async (userId: string, action: "ban" | "unban") => {
    try {
      // Update user status
      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: action === "ban",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) throw error

      // Refresh users
      fetchData()

      toast({
        title: `User ${action === "ban" ? "banned" : "unbanned"}`,
        description: `The user has been ${action === "ban" ? "banned" : "unbanned"} successfully`,
      })
    } catch (error) {
      console.error(`Error ${action}ning user:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} user`,
        variant: "destructive",
      })
    }
  }

  const handleTopicAction = async (topicId: string, action: "remove" | "feature") => {
    try {
      if (action === "remove") {
        // Delete topic
        const { error } = await supabase.from("topics").delete().eq("id", topicId)

        if (error) throw error
      } else {
        // Feature topic
        const { error } = await supabase
          .from("topics")
          .update({
            is_featured: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", topicId)

        if (error) throw error
      }

      // Refresh topics
      fetchData()

      toast({
        title: `Topic ${action === "remove" ? "removed" : "featured"}`,
        description: `The topic has been ${action === "remove" ? "removed" : "featured"} successfully`,
      })
    } catch (error) {
      console.error(`Error ${action}ing topic:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} topic`,
        variant: "destructive",
      })
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 bg-zinc-800 border border-zinc-700">
          <TabsTrigger value="reports" className="flex-1 data-[state=active]:bg-violet-600">
            Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 data-[state=active]:bg-violet-600">
            Users
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex-1 data-[state=active]:bg-violet-600">
            Topics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card className="bg-zinc-800/50 border-zinc-700/50">
            <CardHeader>
              <CardTitle>Content Reports</CardTitle>
              <CardDescription>Review and moderate reported content</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No reports found</div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={report.reporter?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{report.reporter?.username?.[0] || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {report.reporter?.username || "Anonymous"} reported{" "}
                              <span className="text-zinc-400">
                                {report.content_type === "message"
                                  ? "a message"
                                  : report.content_type === "topic"
                                    ? "a topic"
                                    : "a user"}
                              </span>
                            </p>
                            <p className="text-sm text-zinc-500 mt-1">{new Date(report.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            report.status === "pending"
                              ? "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                              : report.status === "approved"
                                ? "bg-green-600/20 text-green-400 border-green-600/30"
                                : "bg-red-600/20 text-red-400 border-red-600/30"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="bg-zinc-700/50 p-3 rounded-md">
                          <p className="text-sm font-medium">Reason: {report.reason}</p>
                          {report.details && <p className="text-sm text-zinc-400 mt-1">{report.details}</p>}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-600"
                            onClick={() => {
                              // View content (implementation depends on content type)
                              if (report.content_type === "message") {
                                // Navigate to message
                              } else if (report.content_type === "topic") {
                                router.push(`/topics/${report.content_id}`)
                              } else if (report.content_type === "user") {
                                router.push(`/profile/${report.content_id}`)
                              }
                            }}
                          >
                            View Content
                          </Button>

                          {report.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-500 hover:bg-red-900/20"
                                onClick={() => handleReportAction(report.id, "reject")}
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleReportAction(report.id, "approve")}
                              >
                                Approve
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-zinc-800/50 border-zinc-700/50">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No users found</div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{user.username?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username || "Anonymous"}</p>
                          <p className="text-sm text-zinc-500">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-600"
                          onClick={() => router.push(`/profile/${user.id}`)}
                        >
                          View Profile
                        </Button>

                        {user.is_banned ? (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleUserAction(user.id, "unban")}
                          >
                            Unban User
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleUserAction(user.id, "ban")}
                          >
                            Ban User
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card className="bg-zinc-800/50 border-zinc-700/50">
            <CardHeader>
              <CardTitle>Topic Management</CardTitle>
              <CardDescription>Manage and moderate topics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                </div>
              ) : topics.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No topics found</div>
              ) : (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <div key={topic.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{topic.title}</h3>
                            {topic.is_featured && (
                              <Badge className="ml-2 bg-violet-600/20 text-violet-400 border-violet-600/30">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{topic.question}</p>
                          <div className="flex items-center mt-2">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={topic.creator?.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback>{topic.creator?.username?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-zinc-500">
                              Created by {topic.creator?.username || "Anonymous"} on{" "}
                              {new Date(topic.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Badge className="bg-zinc-700 text-zinc-300 border-zinc-600">{topic.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-600"
                          onClick={() => router.push(`/topics/${topic.id}`)}
                        >
                          View Topic
                        </Button>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-500 hover:bg-red-900/20"
                            onClick={() => handleTopicAction(topic.id, "remove")}
                          >
                            Remove
                          </Button>

                          {!topic.is_featured && (
                            <Button
                              size="sm"
                              className="bg-violet-600 hover:bg-violet-700"
                              onClick={() => handleTopicAction(topic.id, "feature")}
                            >
                              Feature
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
