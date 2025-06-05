import { createClient } from '@/utils/supabase/client'

export async function getTopMessagesForCircle(circleId: string) {
  const supabase = createClient()

  const { data: circle } = await supabase
    .from('circles')
    .select('topic_id')
    .eq('id', circleId)
    .single()

  if (!circle) return []

  const { data: messages } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      created_at,
      media_url,
      user_id,
      message_votes (vote_count),
      message_reactions (reaction_type)
    `)
    .eq('topic_id', circle.topic_id)
    .order('created_at', { ascending: false })
    .limit(10)

  return messages?.map((msg) => ({
    ...msg,
    votes: msg.message_votes?.[0]?.vote_count || 0,
    reactions: msg.message_reactions || [],
  }))
} 