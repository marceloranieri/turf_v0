"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useAuth } from "./auth-context"

type Topic = Database["public"]["Tables"]["topics"]["Row"]
type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  user: {
    username: string
    full_name: string
    avatar_url: string | null
  }
  replies?: (Message & {
    reactions: Reaction[]
    votes: number
    upvoted: boolean
    downvoted: boolean
  })[]
  reactions: Reaction[]
  votes: number
  upvoted: boolean
  downvoted: boolean
}
type Reaction = Database["public"]["Tables"]["reactions"]["Row"]

type TopicsContextType = {
  fetchTopics: (category?: string) => Promise<Topic[]>
  fetchTopic: (id: string) => Promise<Topic | null>
  fetchMessages: (topicId: string) => Promise<Message[]>
  createMessage: (topicId: string, content: string, imageUrl?: string, parentId?: string) => Promise<Message | null>
  voteMessage: (messageId: string, isUpvote: boolean) => Promise<void>
  addReaction: (messageId: string, emoji: string) => Promise<void>
}

const TopicsContext = createContext<TopicsContextType | undefined>(undefined)

export function TopicsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const fetchTopics = async (category?: string) => {
    try {
      let query = supabase.from("topics").select("*").order("created_at", { ascending: false })

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching topics:", error)
      return []
    }
  }

  const fetchTopic = async (id: string) => {
    try {
      const { data, error } = await supabase.from("topics").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching topic:", error)
      return null
    }
  }

  const fetchMessages = async (topicId: string) => {
    try {
      // Fetch messages
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          user:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("topic_id", topicId)
        .is("parent_id", null)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Fetch replies for each message
      const messagesWithReplies = await Promise.all(
        messages.map(async (message) => {
          // Fetch replies
          const { data: replies, error: repliesError } = await supabase
            .from("messages")
            .select(`
              *,
              user:user_id (
                username,
                full_name,
                avatar_url
              )
            `)
            .eq("parent_id", message.id)
            .order("created_at", { ascending: true })

          if (repliesError) throw repliesError

          // Fetch reactions for each reply
          const repliesWithReactions = await Promise.all(
            replies.map(async (reply) => {
              const { data: reactions, error: reactionsError } = await supabase
                .from("reactions")
                .select("*")
                .eq("message_id", reply.id)

              if (reactionsError) throw reactionsError

              // Fetch votes for the reply
              const { data: votes, error: votesError } = await supabase
                .from("votes")
                .select("*")
                .eq("message_id", reply.id)

              if (votesError) throw votesError

              // Calculate vote count
              const upvotes = votes.filter((v) => v.is_upvote).length
              const downvotes = votes.filter((v) => !v.is_upvote).length
              const voteCount = upvotes - downvotes

              // Check if current user has voted
              let upvoted = false
              let downvoted = false
              if (user) {
                upvoted = votes.some((v) => v.user_id === user.id && v.is_upvote)
                downvoted = votes.some((v) => v.user_id === user.id && !v.is_upvote)
              }

              return {
                ...reply,
                reactions: reactions || [],
                votes: voteCount,
                upvoted,
                downvoted,
              }
            }),
          )

          // Fetch reactions for the message
          const { data: reactions, error: reactionsError } = await supabase
            .from("reactions")
            .select("*")
            .eq("message_id", message.id)

          if (reactionsError) throw reactionsError

          // Fetch votes for the message
          const { data: votes, error: votesError } = await supabase
            .from("votes")
            .select("*")
            .eq("message_id", message.id)

          if (votesError) throw votesError

          // Calculate vote count
          const upvotes = votes.filter((v) => v.is_upvote).length
          const downvotes = votes.filter((v) => !v.is_upvote).length
          const voteCount = upvotes - downvotes

          // Check if current user has voted
          let upvoted = false
          let downvoted = false
          if (user) {
            upvoted = votes.some((v) => v.user_id === user.id && v.is_upvote)
            downvoted = votes.some((v) => v.user_id === user.id && !v.is_upvote)
          }

          return {
            ...message,
            replies: repliesWithReactions,
            reactions: reactions || [],
            votes: voteCount,
            upvoted,
            downvoted,
          }
        }),
      )

      return messagesWithReplies
    } catch (error) {
      console.error("Error fetching messages:", error)
      return []
    }
  }

  const createMessage = async (topicId: string, content: string, imageUrl?: string, parentId?: string) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("messages")
        .insert({
          topic_id: topicId,
          user_id: user.id,
          content,
          image_url: imageUrl || null,
          parent_id: parentId || null,
        })
        .select(`
          *,
          user:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error
      return {
        ...data,
        reactions: [],
        votes: 0,
        upvoted: false,
        downvoted: false,
        replies: [],
      }
    } catch (error) {
      console.error("Error creating message:", error)
      return null
    }
  }

  const voteMessage = async (messageId: string, isUpvote: boolean) => {
    try {
      if (!user) throw new Error("User not authenticated")

      // Check if user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from("votes")
        .select("*")
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingVote) {
        // If vote is the same, remove it (toggle off)
        if (existingVote.is_upvote === isUpvote) {
          const { error: deleteError } = await supabase.from("votes").delete().eq("id", existingVote.id)

          if (deleteError) throw deleteError
        } else {
          // If vote is different, update it
          const { error: updateError } = await supabase
            .from("votes")
            .update({ is_upvote: isUpvote })
            .eq("id", existingVote.id)

          if (updateError) throw updateError
        }
      } else {
        // Create new vote
        const { error: insertError } = await supabase.from("votes").insert({
          message_id: messageId,
          user_id: user.id,
          is_upvote: isUpvote,
        })

        if (insertError) throw insertError
      }
    } catch (error) {
      console.error("Error voting on message:", error)
      throw error
    }
  }

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      if (!user) throw new Error("User not authenticated")

      // Check if user has already reacted with this emoji
      const { data: existingReaction, error: checkError } = await supabase
        .from("reactions")
        .select("*")
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .eq("emoji", emoji)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingReaction) {
        // If reaction exists, remove it (toggle off)
        const { error: deleteError } = await supabase.from("reactions").delete().eq("id", existingReaction.id)

        if (deleteError) throw deleteError
      } else {
        // Create new reaction
        const { error: insertError } = await supabase.from("reactions").insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })

        if (insertError) throw insertError
      }
    } catch (error) {
      console.error("Error adding reaction:", error)
      throw error
    }
  }

  return (
    <TopicsContext.Provider
      value={{
        fetchTopics,
        fetchTopic,
        fetchMessages,
        createMessage,
        voteMessage,
        addReaction,
      }}
    >
      {children}
    </TopicsContext.Provider>
  )
}

export function useTopics() {
  const context = useContext(TopicsContext)
  if (context === undefined) {
    throw new Error("useTopics must be used within a TopicsProvider")
  }
  return context
}
