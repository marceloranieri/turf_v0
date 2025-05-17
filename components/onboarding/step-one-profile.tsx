"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"

export default function StepOneProfile({ 
  profileData, 
  setProfileData, 
  onNext 
}) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setLoading(true)
    try {
      // Upload avatar to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
      
      setProfileData({
        ...profileData,
        avatarUrl: data.publicUrl
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      setError("Failed to upload avatar. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!profileData.username) {
      setError("Username is required")
      return
    }

    // Check if username is available
    const { data, error: usernameError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", profileData.username)
      .not("id", "eq", user?.id || "")
      .maybeSingle()

    if (usernameError) {
      setError("Error checking username availability")
      return
    }

    if (data) {
      setError("Username is already taken")
      return
    }

    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Set Up Your Profile</h2>
        <p className="text-zinc-400 mt-2">Tell us a bit about yourself</p>
      </div>

      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={profileData.avatarUrl || "/placeholder.svg"} />
          <AvatarFallback className="bg-violet-600">
            {profileData.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          {loading ? "Uploading..." : "Choose Avatar"}
        </Label>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={loading}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username (required)</Label>
          <Input
            id="username"
            placeholder="Choose a unique username"
            value={profileData.username}
            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name (optional)</Label>
          <Input
            id="fullName"
            placeholder="Your full name"
            value={profileData.fullName}
            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio (optional)</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            className="bg-zinc-800 border-zinc-700 min-h-[100px]"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-violet-600 hover:bg-violet-700"
        disabled={loading}
      >
        Next
      </Button>
    </form>
  )
} 