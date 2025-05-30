"use client"

import { useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@supabase/ssr"
import Image from "next/image"
import { useRouter } from "next/navigation"

type SuggestedUser = {
  id: string
  username: string
  avatar_url: string
  bio: string
  message_count: number
  is_following?: boolean
}

export default function SuggestedUsers() {
  const [users, setUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    const fetchUsers = async () => {
      // Get current user's follows
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: follows } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id)
        
        if (follows) {
          setFollowing(new Set(follows.map(f => f.following_id)))
        }
      }

      // Get suggested users
      const { data, error } = await supabase.rpc("get_most_active_users_today")
      if (!error && data) {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  const handleFollow = async (userId: string) => {
    const supabase = createBrowserSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const isFollowing = following.has(userId)
    const newFollowing = new Set(following)

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId)

        if (!error) {
          newFollowing.delete(userId)
          setFollowing(newFollowing)
        }
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert([
            { follower_id: user.id, following_id: userId }
          ])

        if (!error) {
          newFollowing.add(userId)
          setFollowing(newFollowing)
        }
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
    }
  }

  if (loading) return null
  if (!users.length) return <p className="text-zinc-500 text-sm italic">No active users yet.</p>

  return (
    <div className="space-y-4">
      <h3 className="text-white text-sm font-semibold">Suggested Users</h3>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2 hover:bg-zinc-700 transition"
        >
          <div className="flex items-center gap-3">
            <Image
              src={user.avatar_url || "/default-avatar.png"}
              alt={user.username}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col text-sm">
              <span className="text-white">{user.username}</span>
              <span className="text-zinc-400 text-xs">{user.bio || "Active on Turf"}</span>
            </div>
          </div>
          <button
            onClick={() => handleFollow(user.id)}
            className={`text-xs transition-colors ${
              following.has(user.id)
                ? 'text-zinc-400 hover:text-zinc-300'
                : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            {following.has(user.id) ? 'Following' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  )
} 