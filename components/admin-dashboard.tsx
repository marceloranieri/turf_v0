"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/components/providers/SupabaseProvider"

export function AdminDashboard() {
  const router = useRouter()
  const supabase = useSupabase()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("reports")
  const [reports, setReports] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        return
      }

      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push("/login")
        return
      }

      setUserId(session.user.id)
      await checkAdminStatus(session.user.id)
    }

    checkAuth()
  }, [supabase, router])

  const checkAdminStatus = async (userId: string) => {
    try {
      // Check if user is admin
      const { data, error } = await supabase.from("admin_users").select("*").eq("user_id", userId).single()

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

  const fetchData = async () => {
    if (!supabase) return
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
    if (!supabase || !userId) return

    try {
      // Update report status
      const { error } = await supabase
        .from("reports")
        .update({
          status: action === "approve" ? "approved" : "rejected",
          resolved_at: new Date().toISOString(),
          resolved_by: userId,
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
    if (!supabase) return

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
    if (!supabase) return

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

  if (!supabase) {
    return (
      <div className="text-zinc-400 text-sm p-6">
        Connecting to Turf...
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-zinc-400 text-sm p-6">
        Loading admin dashboard...
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Manage reports, users, and topics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>

            <TabsContent value="reports">
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={report.reporter?.avatar_url} />
                            <AvatarFallback>{report.reporter?.username?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{report.reporter?.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(report.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={report.status === "pending" ? "default" : report.status === "approved" ? "success" : "destructive"}>
                          {report.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{report.reason}</p>
                      {report.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button onClick={() => handleReportAction(report.id, "approve")}>Approve</Button>
                          <Button variant="destructive" onClick={() => handleReportAction(report.id, "reject")}>Reject</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(user.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={user.is_banned ? "destructive" : "default"}>
                          {user.is_banned ? "Banned" : "Active"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        {user.is_banned ? (
                          <Button onClick={() => handleUserAction(user.id, "unban")}>Unban</Button>
                        ) : (
                          <Button variant="destructive" onClick={() => handleUserAction(user.id, "ban")}>Ban</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="topics">
              <div className="space-y-4">
                {topics.map((topic) => (
                  <Card key={topic.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={topic.creator?.avatar_url} />
                            <AvatarFallback>{topic.creator?.username?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{topic.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Created by {topic.creator?.username} on {new Date(topic.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={topic.is_featured ? "success" : "default"}>
                          {topic.is_featured ? "Featured" : "Regular"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{topic.description}</p>
                      <div className="flex space-x-2">
                        {!topic.is_featured && (
                          <Button onClick={() => handleTopicAction(topic.id, "feature")}>Feature</Button>
                        )}
                        <Button variant="destructive" onClick={() => handleTopicAction(topic.id, "remove")}>Remove</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
