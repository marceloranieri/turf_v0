"use client"

import { useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@supabase/ssr"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

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

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-zinc-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (!users.length) {
    return (
      <p className="text-zinc-500 text-sm italic">
        No active users yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-zinc-800 p-3 rounded-xl hover:bg-zinc-700 hover:scale-[1.01] transition-all duration-200"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src={user.avatar_url || "/default-avatar.png"}
                alt={user.username}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-white text-sm font-medium truncate">
                  {user.username}
                </span>
                <span className="text-zinc-400 text-xs truncate">
                  {user.bio || "Active on Turf"}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user.id)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                following.has(user.id)
                  ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {following.has(user.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 