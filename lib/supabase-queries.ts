import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getTrendingHighlights() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  )
  
  const { data, error } = await supabase
    .from("messages")
    .select(`
      content,
      media_url,
      user_id,
      created_at,
      profiles:user_id (username),
      reactions:message_reactions (count),
      replies:message_replies (count)
    `)
    .order("created_at", { ascending: false })
    .limit(4)

  if (error) {
    console.error("Error fetching highlights:", error)
    return []
  }

  return data?.map(item => ({
    content: item.content,
    media_url: item.media_url,
    username: item.profiles?.username || "anonymous",
    created_at: item.created_at,
    reactions: item.reactions?.length || 0,
    replies: item.replies?.length || 0
  })) || []
}

export async function getTopics() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  )
  
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching topics:", error)
    return []
  }

  return data || []
} 