"use client"

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

// Mock data for the topic
const TOPIC_DATA = {
  id: "1",
  title: "Gaming",
  question: "What's your most memorable gaming experience?",
  activeUsers: 128,
  expiresIn: "23:45:12",
}

// Mock data for messages
const MESSAGES_DATA = [
  {
    id: 1,
    user: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    content:
      "I'll never forget the first time I played Ocarina of Time. The moment you step out into Hyrule Field and that music starts playing... pure magic. It was the first game that made me feel like I was in another world.",
    timestamp: "10:20 AM",
    votes: 24,
    upvoted: true,
    downvoted: false,
    comments: 3,
    shares: 2,
    reactions: [
      { emoji: "❤️", count: 8 },
      { emoji: "👍", count: 5 },
      { emoji: "✨", count: 3 },
    ],
    replies: [
      {
        id: 11,
        user: {
          name: "Jamie Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          isOnline: false,
        },
        content:
          "Same! That moment when you first step out into Hyrule Field is iconic. I remember being blown away by how vast the world seemed.",
        timestamp: "10:25 AM",
        votes: 12,
        upvoted: false,
        downvoted: false,
        reactions: [{ emoji: "💯", count: 4 }],
      },
      {
        id: 12,
        user: {
          name: "Riley Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          isOnline: true,
        },
        content: "The music in that game was incredible. Still gives me chills when I hear it.",
        timestamp: "10:32 AM",
        votes: 8,
        upvoted: false,
        downvoted: false,
        reactions: [
          { emoji: "🎵", count: 3 },
          { emoji: "👂", count: 1 },
        ],
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    content:
      "For me it was the ending of Red Dead Redemption 2. I won't spoil it, but I've never been so emotionally affected by a game before. I literally sat in silence for about 10 minutes after finishing it.",
    timestamp: "10:45 AM",
    votes: 18,
    upvoted: false,
    downvoted: false,
    comments: 2,
    shares: 1,
    reactions: [
      { emoji: "😢", count: 7 },
      { emoji: "❤️", count: 4 },
    ],
    replies: [
      {
        id: 21,
        user: {
          name: "Casey Morgan",
          avatar: "/placeholder.svg?height=40&width=40",
          isOnline: false,
        },
        content: "That game was a masterpiece from start to finish. The character development was incredible.",
        timestamp: "10:52 AM",
        votes: 6,
        upvoted: false,
        downvoted: false,
        reactions: [{ emoji: "👏", count: 2 }],
      },
    ],
  },
  {
    id: 3,
    user: {
      name: "Sam Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    content:
      "Playing through Journey for the first time and realizing that the other character was actually another player. We completed the whole game together without any communication beyond those little chirps. When we reached the end and their username appeared, it hit me that I'd shared this beautiful experience with a real person. Still gives me goosebumps.",
    timestamp: "11:05 AM",
    votes: 32,
    upvoted: false,
    downvoted: false,
    comments: 4,
    shares: 5,
    reactions: [
      { emoji: "✨", count: 12 },
      { emoji: "❤️", count: 9 },
      { emoji: "🥹", count: 6 },
    ],
    replies: [],
  },
  {
    id: 4,
    user: {
      name: "Taylor Reed",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    content:
      "Beating Malenia in Elden Ring after 50+ attempts. I've never felt such a rush of accomplishment in a game!",
    timestamp: "11:18 AM",
    votes: 15,
    upvoted: false,
    downvoted: false,
    comments: 1,
    shares: 0,
    reactions: [
      { emoji: "💪", count: 8 },
      { emoji: "🔥", count: 5 },
    ],
    replies: [
      {
        id: 41,
        user: {
          name: "Alex Chen",
          avatar: "/placeholder.svg?height=40&width=40",
          isOnline: true,
        },
        content: "I'm still stuck on her! Any tips? 😭",
        timestamp: "11:25 AM",
        votes: 3,
        upvoted: false,
        downvoted: false,
        reactions: [{ emoji: "😂", count: 2 }],
      },
    ],
  },
  {
    id: 5,
    user: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    content:
      "The first time I played Minecraft with friends. We stayed up all night building this elaborate castle and fighting off creepers. It wasn't even about the game itself, but the shared experience and laughs we had.",
    timestamp: "11:30 AM",
    votes: 10,
    upvoted: false,
    downvoted: false,
    comments: 0,
    shares: 1,
    reactions: [{ emoji: "🏰", count: 4 }],
    replies: [],
  },
]

export function TopicDetail({ topicId }: { topicId: string }) {
  const router = useRouter()
  const [messages, setMessages] = useState(MESSAGES_DATA)
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [timeLeft, setTimeLeft] = useState(TOPIC_DATA.expiresIn)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      // This is a mock implementation - in a real app, you'd calculate the actual time remaining
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

      if (newHours < 0) {
        // Topic expired
        clearInterval(timer)
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

  const handleVote = (messageId: number, parentId: number | null, isUpvote: boolean) => {
    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (parentId === null) {
          // Top-level message
          if (message.id === messageId) {
            const wasUpvoted = message.upvoted
            const wasDownvoted = message.downvoted

            let voteDelta = 0
            if (isUpvote) {
              if (wasUpvoted) voteDelta = -1
              // Removing upvote
              else if (wasDownvoted) voteDelta = 2
              // Changing from downvote to upvote
              else voteDelta = 1 // Adding upvote
            } else {
              if (wasDownvoted) voteDelta = 1
              // Removing downvote
              else if (wasUpvoted) voteDelta = -2
              // Changing from upvote to downvote
              else voteDelta = -1 // Adding downvote
            }

            return {
              ...message,
              votes: message.votes + voteDelta,
              upvoted: isUpvote ? !wasUpvoted : false,
              downvoted: !isUpvote ? !wasDownvoted : false,
            }
          }
        } else if (message.id === parentId) {
          // Handle votes on replies
          return {
            ...message,
            replies: message.replies.map((reply) => {
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
  }

  const handleReply = (messageId: number) => {
    setReplyTo(messageId)
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      votes: 0,
      upvoted: false,
      downvoted: false,
      comments: 0,
      shares: 0,
      reactions: [],
      replies: [],
    }

    if (replyTo) {
      // Add as a reply
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === replyTo) {
            return {
              ...message,
              replies: [...message.replies, { ...newMessage, id: Date.now() }],
              comments: message.comments + 1,
            }
          }
          return message
        }),
      )
      setReplyTo(null)
    } else {
      // Add as a new message
      setMessages((prevMessages) => [...prevMessages, newMessage])
    }

    setMessageInput("")
  }

  const handleAddReaction = (messageId: number, parentId: number | null, emoji: string) => {
    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (parentId === null && message.id === messageId) {
          // Add reaction to top-level message
          const existingReactionIndex = message.reactions.findIndex((r) => r.emoji === emoji)

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
            return { ...message, reactions: [...message.reactions, { emoji, count: 1 }] }
          }
        } else if (message.id === parentId) {
          // Add reaction to reply
          return {
            ...message,
            replies: message.replies.map((reply) => {
              if (reply.id === messageId) {
                const existingReactionIndex = reply.reactions.findIndex((r) => r.emoji === emoji)

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
                  return { ...reply, reactions: [...reply.reactions, { emoji, count: 1 }] }
                }
              }
              return reply
            }),
          }
        }
        return message
      })
    })
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
            <h1 className="font-semibold text-lg">{TOPIC_DATA.title}</h1>
            <Badge className="ml-2 bg-green-600/20 text-green-400 border-green-600/30 text-xs">Active</Badge>
          </div>
          <p className="text-zinc-300 text-sm">{TOPIC_DATA.question}</p>
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
            <span>{TOPIC_DATA.activeUsers}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="space-y-4">
            <Message
              message={message}
              onVote={(messageId, isUpvote) => handleVote(messageId, null, isUpvote)}
              onReply={handleReply}
              onReaction={(messageId, emoji) => handleAddReaction(messageId, null, emoji)}
            />

            {message.replies.length > 0 && (
              <div className="ml-12 space-y-4 border-l-2 border-zinc-800 pl-4">
                {message.replies.map((reply) => (
                  <Message
                    key={reply.id}
                    message={reply}
                    isReply={true}
                    onVote={(messageId, isUpvote) => handleVote(messageId, message.id, isUpvote)}
                    onReply={() => handleReply(message.id)}
                    onReaction={(messageId, emoji) => handleAddReaction(messageId, message.id, emoji)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-zinc-800/50 border-t border-zinc-700/50 flex items-center">
          <span className="text-sm text-zinc-400">
            Replying to{" "}
            <span className="font-medium text-zinc-300">{messages.find((m) => m.id === replyTo)?.user.name}</span>
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
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <Input
          className="flex-1 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700"
          placeholder={replyTo ? "Type your reply..." : "Post your reply..."}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
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

function Message({
  message,
  isReply = false,
  onVote,
  onReply,
  onReaction,
}: {
  message: any
  isReply?: boolean
  onVote: (messageId: number, isUpvote: boolean) => void
  onReply: (messageId: number) => void
  onReaction: (messageId: number, emoji: string) => void
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
          <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
          <AvatarFallback>{message.user.name[0]}</AvatarFallback>
        </Avatar>
        {message.user.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-medium">{message.user.name}</span>
          <span className="ml-2 text-sm text-zinc-500">{message.timestamp}</span>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-zinc-400 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-zinc-300">{message.content}</p>

        {/* Reactions */}
        {message.reactions.length > 0 && (
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
              {message.comments > 0 && <span className="text-xs">{message.comments}</span>}
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
              {message.shares > 0 && <span className="text-xs">{message.shares}</span>}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
