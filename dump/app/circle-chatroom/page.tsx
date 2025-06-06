"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function CircleChatroomPage() {
  const router = useRouter()
  const { supabase } = useAuth()

  useEffect(() => {
    async function fetchCurrentTopic() {
      const { data, error } = await supabase
        .from('current_topic')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching current topic:', error)
        return
      }

      if (data?.slug) {
        router.push(`/circle-chatroom/${data.slug}`)
      }
    }

    fetchCurrentTopic()
  }, [supabase, router])

  return null // This page will redirect, so no need to render anything
}
