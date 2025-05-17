"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { useAuth } from "@/context/auth-context"

export function EmailPreferences() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { toast } = useToast()
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

  useEffect(() => {
    if (!user) return

    const fetchPreferences = async () => {
      setLoading(true)
      
      try {
        // Get user email
        const { data: profileData } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", user.id)
          .single()
        
        if (profileData?.email) {
          setEmail(profileData.email)
        } else {
          // Fallback to auth email
          const { data } = await supabase.auth.getUser()
          setEmail(data.user?.email || "")
        }
        
        // Get email preferences
        const { data, error } = await supabase
          .from("email_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single()
        
        if (error && error.code !== "PGRST116") {
          console.error("Error fetching email preferences:", error)
          return
        }
        
        if (data) {
          setPreferences({
            mentions: data.mentions,
            replies: data.replies,
            new_followers: data.new_followers,
            new_posts: data.new_posts,
            direct_messages: data.direct_messages,
            marketing: data.marketing
          })
        } else {
          // Create default preferences
          await supabase.from("email_preferences").insert({
            user_id: user.id,
            ...preferences
          })
        }
      } catch (error) {
        console.error("Error setting up preferences:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [supabase, user])

  const handleSavePreferences = async () => {
    if (!user) return
    
    setSaving(true)
    
    try {
      // Update email in profile
      await supabase
        .from("profiles")
        .update({ email })
        .eq("id", user.id)
      
      // Update email preferences
      const { error } = await supabase
        .from("email_preferences")
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      toast({
        title: "Preferences saved",
        description: "Your email preferences have been updated.",
        duration: 3000
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error saving preferences",
        description: "There was a problem saving your preferences.",
        variant: "destructive",
        duration: 3000
      })
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
              onCheckedChange={(checked) => setPreferences({ ...preferences, mentions: checked })}
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
              onCheckedChange={(checked) => setPreferences({ ...preferences, replies: checked })}
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
              onCheckedChange={(checked) => setPreferences({ ...preferences, new_followers: checked })}
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
              onCheckedChange={(checked) => setPreferences({ ...preferences, new_posts: checked })}
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
              onCheckedChange={(checked) => setPreferences({ ...preferences, direct_messages: checked })}
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
              onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSavePreferences} 
          disabled={saving}
          className="mt-4 w-full bg-[#4CAF50] hover:bg-[#3d8b40]"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  )
} 