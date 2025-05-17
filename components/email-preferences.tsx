"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { updateEmailPreferences } from "@/lib/supabase-email"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function EmailPreferences() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    daily_digest: true,
    new_followers: true,
    replies: true,
    mentions: true,
    topic_activity: true,
  })

  useEffect(() => {
    if (!user) return

    const fetchPreferences = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("email_preferences").select("*").eq("user_id", user.id).single()

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching email preferences:", error)
          return
        }

        if (data) {
          setPreferences({
            daily_digest: data.daily_digest ?? true,
            new_followers: data.new_followers ?? true,
            replies: data.replies ?? true,
            mentions: data.mentions ?? true,
            topic_activity: data.topic_activity ?? true,
          })
        }
      } catch (error) {
        console.error("Error in fetchPreferences:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [user])

  const handleToggle = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      const result = await updateEmailPreferences(user.id, preferences)

      if (!result.success) {
        throw new Error("Failed to update preferences")
      }

      toast({
        title: "Preferences updated",
        description: "Your email notification preferences have been saved.",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Email Notifications</CardTitle>
        <CardDescription className="text-zinc-400">Choose which emails you'd like to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Daily Digest</h3>
              <p className="text-xs text-zinc-400">Receive a daily summary of activity in your topics</p>
            </div>
            <Switch
              checked={preferences.daily_digest}
              onCheckedChange={() => handleToggle("daily_digest")}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">New Followers</h3>
              <p className="text-xs text-zinc-400">Get notified when someone follows you</p>
            </div>
            <Switch
              checked={preferences.new_followers}
              onCheckedChange={() => handleToggle("new_followers")}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Replies</h3>
              <p className="text-xs text-zinc-400">Get notified when someone replies to your messages</p>
            </div>
            <Switch
              checked={preferences.replies}
              onCheckedChange={() => handleToggle("replies")}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Mentions</h3>
              <p className="text-xs text-zinc-400">Get notified when someone mentions you</p>
            </div>
            <Switch
              checked={preferences.mentions}
              onCheckedChange={() => handleToggle("mentions")}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Topic Activity</h3>
              <p className="text-xs text-zinc-400">Get notified about new messages in topics you follow</p>
            </div>
            <Switch
              checked={preferences.topic_activity}
              onCheckedChange={() => handleToggle("topic_activity")}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving} className="w-full bg-violet-600 hover:bg-violet-700">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
