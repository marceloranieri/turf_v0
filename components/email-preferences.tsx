"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export function EmailPreferences() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { toast: useToastToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState("")
  const [preferences, setPreferences] = useState({
    mentions: true,
    replies: true,
    new_followers: true,
    new_posts: true,
    direct_messages: true,
    marketing: false
  })

  const updatePreference = async (key: string, value: boolean) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("email_preferences")
        .upsert({
          user_id: user.id,
          [key]: value
        })

      if (error) throw error

      setPreferences(prev => ({ ...prev, [key]: value }))
      toast.success("Preferences updated!")
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast.error("Failed to update preferences")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="animate-pulse bg-gray-800 h-6 w-48 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-gray-800 h-4 w-72 rounded"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="animate-pulse bg-gray-800 h-5 w-32 rounded"></div>
              <div className="animate-pulse bg-gray-800 h-5 w-10 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <CardTitle className="text-2xl font-bold text-gray-800">Email Preferences</CardTitle>
        <CardDescription className="text-gray-600">
          Choose which notifications you'd like to receive via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700"
            placeholder="Your email address"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mentions" className="flex flex-col">
              <span>Mentions</span>
              <span className="text-sm text-gray-400">When someone mentions you in a post</span>
            </Label>
            <Switch
              id="mentions"
              checked={preferences.mentions}
              onCheckedChange={(checked) => updatePreference("mentions", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="replies" className="flex flex-col">
              <span>Replies</span>
              <span className="text-sm text-gray-400">When someone replies to your post</span>
            </Label>
            <Switch
              id="replies"
              checked={preferences.replies}
              onCheckedChange={(checked) => updatePreference("replies", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="new_followers" className="flex flex-col">
              <span>New Followers</span>
              <span className="text-sm text-gray-400">When someone follows you</span>
            </Label>
            <Switch
              id="new_followers"
              checked={preferences.new_followers}
              onCheckedChange={(checked) => updatePreference("new_followers", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="new_posts" className="flex flex-col">
              <span>New Posts</span>
              <span className="text-sm text-gray-400">When someone you follow creates a new post</span>
            </Label>
            <Switch
              id="new_posts"
              checked={preferences.new_posts}
              onCheckedChange={(checked) => updatePreference("new_posts", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="direct_messages" className="flex flex-col">
              <span>Direct Messages</span>
              <span className="text-sm text-gray-400">When you receive a direct message</span>
            </Label>
            <Switch
              id="direct_messages"
              checked={preferences.direct_messages}
              onCheckedChange={(checked) => updatePreference("direct_messages", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing" className="flex flex-col">
              <span>Marketing</span>
              <span className="text-sm text-gray-400">Occasional updates and newsletters from Turf</span>
            </Label>
            <Switch
              id="marketing"
              checked={preferences.marketing}
              onCheckedChange={(checked) => updatePreference("marketing", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
        </div>
        
        <Button 
          onClick={() => {}} 
          disabled={saving}
          className="mt-4 w-full bg-[#4CAF50] hover:bg-[#3d8b40]"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  )
} 