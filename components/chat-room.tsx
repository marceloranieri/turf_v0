"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Maximize2,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Share2,
  ChevronUp,
  ChevronDown,
  Clock,
  Send,
} from "lucide-react"

// Mock data for messages
const initialMessages = [
  {
    id: 1,
    user: {
      name: "Kohaku",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Bento Cards: SimpleList is a complete UI kit for creating stylish to-do list apps and beautiful landing pages. This package includes everything you need to build a user-friendly task management app and a responsive promotional website.",
    image: "/placeholder.svg?height=300&width=600",
    timestamp: "09:20 AM",
    votes: 12,
    upvoted: false,
    downvoted: false,
    comments: 12,
    shares: 5,
    reactions: [
      { emoji: "❤️", count: 8 },
      { emoji: "👍", count: 4 },
    ],
    replies: [],
  },
  {
    id: 2,
    user: {
      name: "Totoro",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Great work! I love the design and functionality. How did you handle the responsive layout?",
    timestamp: "09:35 AM",
    votes: 8,
    upvoted: false,
    downvoted: false,
    comments: 3,
    shares: 1,
    reactions: [{ emoji: "👍", count: 3 }],
    replies: [
      {
        id: 21,
        user: {
          name: "Kohaku",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Thanks! I used a combination of CSS Grid and Flexbox for the responsive layout.",
        timestamp: "09:40 AM",
        votes: 5,
        upvoted: false,
        downvoted: false,
        reactions: [{ emoji: "🙌", count: 2 }],
      },
    ],
  },
  {
    id: 3,
    user: {
      name: "Moyo Shiro",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Truly beautiful ✨ The animations are so smooth!",
    timestamp: "09:50 AM",
    votes: 15,
    upvoted: true,
    downvoted: false,
    comments: 1,
    shares: 2,
    reactions: [
      { emoji: "✨", count: 7 },
      { emoji: "❤️", count: 3 },
    ],
    replies: [],
  },
]

export function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages)
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState("23:45:12")

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
    // @ts-ignore
    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (parentId === null) {
          // Top-level message
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
      // @ts-ignore
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
      // @ts-ignore
      setMessages((prevMessages) => [...prevMessages, newMessage])
    }

    setMessageInput("")
  }

  const handleAddReaction = (messageId: number, parentId: number | null, emoji: string) => {
    // @ts-ignore
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
    <div className="flex-1 flex flex-col bg-zinc-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80">
        <Button variant="ghost" size="icon" className="mr-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <h1 className="font-semibold">UI Design Trends 2024</h1>
          <div className="flex items-center text-sm text-zinc-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>Expires in: </span>
            <Badge variant="outline" className="ml-1 text-xs bg-zinc-800/80 text-zinc-300 border-zinc-700">
              {timeLeft}
            </Badge>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="ml-auto text-zinc-400 hover:text-white">
          <Maximize2 className="h-5 w-5" />
        </Button>
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
          placeholder={replyTo ? "Type your reply..." : "Join the conversation..."}
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
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
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
      <Avatar className="h-10 w-10 mr-3 mt-1">
        <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
        <AvatarFallback>{message.user.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-medium">{message.user.name}</span>
          <span className="ml-2 text-sm text-zinc-500">{message.timestamp}</span>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-zinc-400 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-zinc-300">{message.content}</p>

        {message.image && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img src={message.image || "/placeholder.svg"} alt="Post content" className="w-full object-cover" />
          </div>
        )}

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
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white h-8 ml-auto">
            <Share2 className="h-4 w-4 mr-1" />
            {message.shares > 0 && <span className="text-xs">{message.shares}</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
