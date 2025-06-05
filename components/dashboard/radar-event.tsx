"use client"

import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/SupabaseProvider"

  const supabase = useSupabase()
  const router = useRouter()

  async function handleClick() {
    const userId = supabase.auth.getUser()?.id
    if (!userId || !circleId) return

    await supabase
      .from("circle_members")
      .upsert({ user_id: userId, circle_id: circleId }, { onConflict: "user_id, circle_id" })

    router.push(`/circle/${circleId}`)
  }

  return (
    <div onClick={handleClick} className="cursor-pointer hover:underline text-sm space-y-1">
      <div>
        <strong>{user}</strong> {action}
      </div>
      <div className="text-xs opacity-60">{new Date(time).toLocaleTimeString()}</div>
    </div>
  )
} 