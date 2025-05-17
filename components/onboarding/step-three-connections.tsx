"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"

export default function StepThreeConnections({ 
  onComplete, 
  onBack,
  loading
}) {
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!user) return

      try {
        // Get users with similar interests
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .neq("id", user.id)
          .limit(6)

        if (error) throw error

        setSuggestedUsers(data || [])
      } catch (error) {
        console.error("Error fetching suggested users:", error)
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchSuggestedUsers()
  }, [user])

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleComplete = async () => {
    if (!user) return

    try {
      // Follow selected users
      if (selectedUsers.length > 0) {
        const followData = selectedUsers.map(followingId => ({
          follower_id: user.id,
          following_id: followingId
        }))

        await supabase.from("follows").insert(followData)
      }

      // Complete onboarding
      onComplete()
    } catch (error) {
      console.error("Error following users:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Find People to Follow</h2>
        <p className="text-zinc-400 mt-2">
          Connect with people to see their posts in your feed
        </p>
      </div>

      {loadingUsers ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {suggestedUsers.map((suggestedUser) => (
            <div
              key={suggestedUser.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUsers.includes(suggestedUser.id)
                  ? "bg-violet-900/50 border border-violet-500"
                  : "bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700"
              }`}
              onClick={() => toggleUserSelection(suggestedUser.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={suggestedUser.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-violet-600">
                  {suggestedUser.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{suggestedUser.username}</p>
                <p className="text-sm text-zinc-400 truncate">{suggestedUser.full_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-zinc-700"
          disabled={loading}
        >
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          className="bg-violet-600 hover:bg-violet-700"
          disabled={loading}
        >
          {loading ? "Completing..." : "Complete"}
        </Button>
      </div>
    </div>
  )
} 