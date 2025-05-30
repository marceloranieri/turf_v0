"use client"

import { useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@supabase/ssr"
import Image from "next/image"

type SuggestedUser = {
  id: string
  username: string
  avatar_url: string
  bio: string
  message_count: number
}

export default function SuggestedUsers() {
  const [users, setUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    const fetchUsers = async () => {
      const { data, error } = await supabase.rpc("get_most_active_users_today")
      if (!error && data) {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

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
          <button className="text-indigo-400 text-xs hover:underline">Follow</button>
        </div>
      ))}
    </div>
  )
} 