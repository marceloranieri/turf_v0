"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Clock,
  Users,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Share2,
  ChevronUp,
  ChevronDown,
  Send,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useTopics } from "@/context/topics-context"
import { useRealtime } from "@/context/realtime-context"
import { useProfile } from "@/context/profile-context"
import { useSupabaseClient } from "@supabase/supabase-js"

// Utility function for debouncing
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function TopicDetailRealtime({ topicId }: { topicId: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const { profile } = useProfile()
  const { fetchTopic, fetchMessages, createMessage, voteMessage, addReaction } = useTopics()
  const { setupPostSubscription, setupTypingIndicator, setTypingStatus } = useRealtime()
  const supabase = useSupabaseClient()

  const [topic, setTopic] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [timeLeft, setTimeLeft] = useState("")
  const [typingUsers, setTypingUsers] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch topic and messages
  useEffect(() => {
    const loadData = async () => {
      const topicData = await fetchTopic(topicId)
      if (topicData) {
        setTopic(topicData)

        // Calculate time left
        const expiresAt = new Date(topicData.expires_at)
        const now = new Date()
        const diff = expiresAt.getTime() - now.getTime()

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeLeft(
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          )
        } else {
          setTimeLeft("00:00:00")
        }
      }

      const messagesData = await fetchMessages(topicId)
      setMessages(messagesData)
    }

    loadData()
  }, [topicId, fetchTopic, fetchMessages])

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to message updates
    const unsubscribeMessages = setupPostSubscription(topicId, async (payload) => {
      if (payload.eventType === "INSERT") {
        // Fetch the new message with user data
        const messagesData = await fetchMessages(topicId)
        setMessages(messagesData)
      } else if (payload.eventType === "UPDATE") {
        // Update the existing message
        setMessages((prev) =>
          prev.map((message) => (message.id === payload.new.id ? { ...message, ...payload.new } : message)),
        )
      }
    })

    // Subscribe to typing indicators
    const unsubscribeTyping = setupTypingIndicator(topicId, async (payload) => {
      if (payload.new.is_typing) {
        // Fetch user info
        const { data: userData } = await supabase
          .from("profiles")
          .select("username, full_name, avatar_url")
          .eq("id", payload.new.user_id)
          .single()

        if (userData && payload.new.user_id !== user?.id) {
          setTypingUsers((prev) => {
            // Add user if not already in the list
            if (!prev.find((u) => u.id === payload.new.user_id)) {
              return [...prev, { id: payload.new.user_id, ...userData }]
            }
            return prev
          })

          // Remove user after 3 seconds of no updates
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter((u) => u.id !== payload.new.user_id))
          }, 3000)
        }
      } else {
        // Remove user from typing list
        setTypingUsers((prev) => prev.filter((u) => u.id !== payload.new.user_id))
      }
    })

    return () => {
      unsubscribeMessages()
      unsubscribeTyping()
    }
  }, [topicId, setupPostSubscription, setupTypingIndicator, user, supabase])

  // Update countdown timer
  useEffect(() => {
    if (!timeLeft) return

    const timer = setInterval(() => {
      const [hours, minutes, seconds] = timeLeft.split(":").map(Number)
      let newSeconds = seconds - 1
      let newMinutes = minutes
      let newHours = hours

      if (newSeconds < 0) {
        newSeconds = 59
        newMinutes -= 1
      }

      if (newMinutes < 0) {
        newMinutes = 59
        newHours -= 1
      }

      if (newHours < 0 || (newHours === 0 && newMinutes === 0 && newSeconds === 0)) {
        // Topic expired
        clearInterval(timer)
        setTimeLeft("00:00:00")
        return
      }

      setTimeLeft(
        `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${newSeconds
          .toString()
          .padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle typing indicator
  const debouncedTypingUpdate = useRef(
    debounce((isTyping: boolean) => {
      setTypingStatus(topicId, isTyping)
    }, 500),
  ).current

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessageInput(value)

    // Update typing status
    if (value.length > 0) {
      debouncedTypingUpdate(true)
    } else {
      debouncedTypingUpdate(false)
    }
  }

  const handleVote = async (messageId: string, isUpvote: boolean) => {
    try {
      await voteMessage(messageId, isUpvote)

      // Optimistic update
      setMessages((prevMessages) => {
        return prevMessages.map((message) => {
          if (message.id === messageId) {
            const wasUpvoted = message.upvoted
            const wasDownvoted = message.downvoted

            let voteDelta = 0
            if (isUpvote) {
              if (wasUpvoted)
                voteDelta = -1 // Removing upvote
              else if (wasDownvoted)
                voteDelta = 2 // Changing from downvote to upvote
              else voteDelta = 1 // Adding upvote
            } else {
              if (wasDownvoted)
                voteDelta = 1 // Removing downvote
              else if (wasUpvoted)
                voteDelta = -2 // Changing from upvote to downvote
              else voteDelta = -1 // Adding downvote
            }

            return {
              ...message,
              votes: message.votes + voteDelta,
              upvoted: isUpvote ? !wasUpvoted : false,
              downvoted: !isUpvote ? !wasDownvoted : false,
            }
          } else if (message.replies) {
            // Check replies
            return {
              ...message,
              replies: message.replies.map((reply: any) => {
                if (reply.id === messageId) {
                  const wasUpvoted = reply.upvoted
                  const wasDownvoted = reply.downvoted

                  let voteDelta = 0
                  if (isUpvote) {
                    if (wasUpvoted) voteDelta = -1
                    else if (wasDownvoted) voteDelta = 2
                    else voteDelta = 1
                  } else {
                    if (wasDownvoted) voteDelta = 1
                    else if (wasUpvoted) voteDelta = -2
                    else voteDelta = -1
                  }

                  return {
                    ...reply,
                    votes: reply.votes + voteDelta,
                    upvoted: isUpvote ? !wasUpvoted : false,
                    downvoted: !isUpvote ? !wasDownvoted : false,
                  }
                }
                return reply
              }),
            }
          }
          return message
        })
      })
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const handleReply = (messageId: string) => {
    setReplyTo(messageId)
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user) return

    try {
      // Clear typing status
      setTypingStatus(topicId, false)

      // Create message
      const newMessage = await createMessage(topicId, messageInput, undefined, replyTo || undefined)

      if (newMessage) {
        // Clear input and reply state
        setMessageInput("")
        setReplyTo(null)

        // Messages will be updated via subscription
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji)

      // Optimistic update
      setMessages((prevMessages) => {
        return prevMessages.map((message) => {
          if (message.id === messageId) {
            // Add reaction to top-level message
            const existingReactionIndex = message.reactions.findIndex((r: any) => r.emoji === emoji)

            if (existingReactionIndex >= 0) {
              // Increment existing reaction
              const updatedReactions = [...message.reactions]
              updatedReactions[existingReactionIndex] = {
                ...updatedReactions[existingReactionIndex],
                count: updatedReactions[existingReactionIndex].count + 1,
              }
              return { ...message, reactions: updatedReactions }
            } else {
              // Add new reaction
              return {
                ...message,
                reactions: [...message.reactions, { emoji, count: 1 }],
              }
            }
          } else if (message.replies) {
            // Check replies
            return {
              ...message,
              replies: message.replies.map((reply: any) => {
                if (reply.id === messageId) {
                  const existingReactionIndex = reply.reactions.findIndex((r: any) => r.emoji === emoji)

                  if (existingReactionIndex >= 0) {
                    // Increment existing reaction
                    const updatedReactions = [...reply.reactions]
                    updatedReactions[existingReactionIndex] = {
                      ...updatedReactions[existingReactionIndex],
                      count: updatedReactions[existingReactionIndex].count + 1,
                    }
                    return { ...reply, reactions: updatedReactions }
                  } else {
                    // Add new reaction
                    return {
                      ...reply,
                      reactions: [...reply.reactions, { emoji, count: 1 }],
                    }
                  }
                }
                return reply
              }),
            }
          }
          return message
        })
      })
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Topic Header */}
      <div className="sticky top-0 z-10 flex items-center p-4 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/90">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-zinc-400 hover:text-white"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg">{topic.title}</h1>
            <Badge className="ml-2 bg-green-600/20 text-green-400 border-green-600/30 text-xs">Active</Badge>
          </div>
          <p className="text-zinc-300 text-sm">{topic.question}</p>
        </div>

        <div className="flex items-center ml-4 space-x-4">
          <div className="flex items-center text-sm text-zinc-400">
            <Clock className="h-4 w-4 mr-1" />
            <Badge variant="outline" className="text-xs bg-zinc-800/80 text-zinc-300 border-zinc-700">
              {timeLeft}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-zinc-400">
            <Users className="h-4 w-4 mr-1" />
            <span>{messages.length}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="space-y-4">
            <Message
              message={message}
              onVote={(messageId, isUpvote) => handleVote(messageId, isUpvote)}
              onReply={handleReply}
              onReaction={(messageId, emoji) => handleAddReaction(messageId, emoji)}
            />

            {message.replies && message.replies.length > 0 && (
              <div className="ml-12 space-y-4 border-l-2 border-zinc-800 pl-4">
                {message.replies.map((reply: any) => (
                  <Message
                    key={reply.id}
                    message={reply}
                    isReply={true}
                    onVote={(messageId, isUpvote) => handleVote(messageId, isUpvote)}
                    onReply={() => handleReply(message.id)}
                    onReaction={(messageId, emoji) => handleAddReaction(messageId, emoji)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 bg-zinc-800/30 border-t border-zinc-700/30">
          <div className="flex items-center text-sm text-zinc-400">
            <div className="flex space-x-1 mr-2">
              {typingUsers.slice(0, 3).map((user) => (
                <Avatar key={user.id} className="h-6 w-6">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0].username} is typing...`
                : typingUsers.length === 2
                  ? `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`
                  : `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing...`}
            </span>
          </div>
        </div>
      )}

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-zinc-800/50 border-t border-zinc-700/50 flex items-center">
          <span className="text-sm text-zinc-400">
            Replying to{" "}
            <span className="font-medium text-zinc-300">
              {messages.find((m) => m.id === replyTo)?.user?.username ||
                messages.flatMap((m) => m.replies || []).find((r: any) => r.id === replyTo)?.user?.username}
            </span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-zinc-400 hover:text-white"
            onClick={() => setReplyTo(null)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80 flex items-center">
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=32&width=32"} />
          <AvatarFallback>{profile?.username?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <Input
          className="flex-1 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700"
          placeholder={replyTo ? "Type your reply..." : "Post your reply..."}
          value={messageInput}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />
        <Button
          className="ml-2 bg-violet-600 hover:bg-violet-700 text-white"
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Message component
function Message({
  message,
  isReply = false,
  onVote,
  onReply,
  onReaction,
}: {
  message: any
  isReply?: boolean
  onVote: (messageId: string, isUpvote: boolean) => void
  onReply: (messageId: string) => void
  onReaction: (messageId: string, emoji: string) => void
}) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  const reactions = [
    { emoji: "👍", label: "Thumbs Up" },
    { emoji: "❤️", label: "Heart" },
    { emoji: "😂", label: "Laugh" },
    { emoji: "😮", label: "Wow" },
    { emoji: "🎉", label: "Celebrate" },
    { emoji: "✨", label: "Sparkles" },
  ]

  return (
    <div className="flex">
      <div className="relative mr-3 mt-1">
        <Avatar className="h-10 w-10">
          <AvatarImage src={message.user?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>{message.user?.username?.[0] || "U"}</AvatarFallback>
        </Avatar>
        {message.user?.is_online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-medium">{message.user?.username || "Anonymous"}</span>
          <span className="ml-2 text-sm text-zinc-500">
            {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-zinc-400 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-zinc-300">{message.content}</p>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.reactions.map((reaction: any, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                onClick={() => onReaction(message.id, reaction.emoji)}
              >
                {reaction.emoji} {reaction.count}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-2 flex items-center">
          {/* Voting */}
          <div className="flex items-center mr-4 bg-zinc-800/50 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-r-none ${
                message.upvoted ? "text-green-500" : "text-zinc-400 hover:text-white"
              }`}
              onClick={() => onVote(message.id, true)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            <span className="px-2 text-sm font-medium">{message.votes}</span>

            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-l-none ${
                message.downvoted ? "text-red-500" : "text-zinc-400 hover:text-white"
              }`}
              onClick={() => onVote(message.id, false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Reply button */}
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white h-8"
              onClick={() => onReply(message.id)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {message.replies?.length > 0 && <span className="text-xs">{message.replies.length}</span>}
            </Button>
          )}

          {/* Reaction button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white h-8"
              onClick={() => setShowReactionPicker(!showReactionPicker)}
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">React</span>
            </Button>

            {showReactionPicker && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-zinc-800 rounded-md border border-zinc-700 flex gap-1 z-10">
                {reactions.map((reaction) => (
                  <TooltipProvider key={reaction.emoji}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="text-lg hover:bg-zinc-700 p-1 rounded-md cursor-pointer"
                          onClick={() => {
                            onReaction(message.id, reaction.emoji)
                            setShowReactionPicker(false)
                          }}
                        >
                          {reaction.emoji}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{reaction.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </div>

          {/* Share button */}
          {!isReply && (
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white h-8 ml-auto">
              <Share2 className="h-4 w-4 mr-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
