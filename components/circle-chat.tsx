"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Flag } from "lucide-react"
import { CircleRadar } from "./circle-radar"
import { ReportMessageModal } from "./report-message-modal"
import { MessageWithMentions } from "./message-with-mentions"
import { EnhancedMessageComposer } from "./enhanced-message-composer"

// Mock users in the chatroom
const CHATROOM_USERS = [
  {
    id: "user1",
    name: "Kohaku",
    username: "kohaku",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user2",
    name: "Totoro",
    username: "totoro",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user3",
    name: "Moyo Shiro",
    username: "moyoshiro",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "current_user",
    name: "You",
    username: "you",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Enhanced mock messages matching the reference image exactly
const MOCK_MESSAGES = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Kohaku",
      username: "kohaku",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Bento Cards: SimpleList is a complete UI kit for creating stylish to-do list apps and beautiful landing pages. This package includes everything you need to build a user-friendly task management app and a responsive promotional website.",
    timestamp: "09:00 AM",
    mentions: [],
    reactions: [
      { emoji: "❤️", count: 12, users: ["user2", "user3"], reacted: false },
      { emoji: "👍", count: 12, users: ["user1", "user3"], reacted: false },
    ],
    replies: 12,
    bookmarked: false,
    image: "/placeholder.svg?height=300&width=500&text=Bento+Cards+UI+Kit",
    embedType: "image",
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Totoro",
      username: "totoro",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Great work",
    timestamp: "2h ago",
    mentions: [],
    reactions: [{ emoji: "👍", count: 12, users: ["user1"], reacted: false }],
    replies: 12,
    bookmarked: false,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Moyo Shiro",
      username: "moyoshiro",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Truly beautiful 🔥",
    timestamp: "09:30 AM",
    mentions: [],
    reactions: [
      { emoji: "❤️", count: 3, users: ["user1"], reacted: false },
      { emoji: "👍", count: 2, users: ["user2"], reacted: false },
      { emoji: "😂", count: 1, users: ["user3"], reacted: false },
    ],
    replies: 1,
    bookmarked: false,
  },
]

export function CircleChat() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [messageMentions, setMessageMentions] = useState<any[]>([])
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [reportingMessage, setReportingMessage] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleMessageChange = (value: string, mentions: any[]) => {
    setNewMessage(value)
    setMessageMentions(mentions)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      user: {
        id: "current_user",
        name: "You",
        username: "you",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mentions: messageMentions,
      reactions: [],
      replies: 0,
      bookmarked: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setMessageMentions([])
    setReplyTo(null)
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, reacted: !r.reacted } : r,
              ),
            }
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: ["current_user"], reacted: true }],
            }
          }
        }
        return msg
      }),
    )
  }

  const toggleBookmark = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, bookmarked: !msg.bookmarked } : msg)))
  }

  return (
    <div className="flex h-full bg-zinc-900">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Daily Topic Header - Matches reference exactly */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-zinc-900/95 to-zinc-800/95 backdrop-blur-sm border-b border-zinc-700/50 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-white font-semibold text-lg mb-1">Today's Circle</h1>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Could John Wick kill the Predator if he had access to all his weapons and the fight took place in the
              Continental Hotel?
            </p>
            <div className="flex items-center mt-2 text-xs text-zinc-400">
              <span>Expires in 18h 32m</span>
              <span className="mx-2">•</span>
              <span>{CHATROOM_USERS.length} participants</span>
            </div>
          </div>
        </div>

        {/* Messages - Tighter spacing to match Discord */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onReaction={handleReaction}
                onBookmark={toggleBookmark}
                onReply={() => setReplyTo(message.id)}
                onReport={() => setReportingMessage(message)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Message Composer */}
        <div className="border-t border-zinc-700/50 bg-zinc-900/95">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <EnhancedMessageComposer
              value={newMessage}
              onChange={handleMessageChange}
              onSend={handleSendMessage}
              users={CHATROOM_USERS.filter((u) => u.id !== "current_user")}
              mentions={messageMentions}
              maxLength={300}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Radar Panel */}
      <div className="w-80 border-l border-zinc-700/50 bg-zinc-900/50">
        <Tabs defaultValue="radar" className="h-full">
          <TabsList className="w-full bg-zinc-800/50 rounded-none border-b border-zinc-700/50 h-12">
            <TabsTrigger value="leaderboard" className="flex-1 text-sm font-medium">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="radar" className="flex-1 text-sm font-medium">
              Radar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="h-full mt-0">
            <CircleRadar />
          </TabsContent>

          <TabsContent value="leaderboard" className="h-full mt-0 p-4">
            <div className="text-center text-zinc-400 mt-8">
              <p>Leaderboard coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Modal */}
      {reportingMessage && (
        <ReportMessageModal
          message={reportingMessage}
          dailyTopic={{
            id: "1",
            title:
              "Could John Wick kill the Predator if he had access to all his weapons and the fight took place in the Continental Hotel?",
            date: new Date().toLocaleDateString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }}
          onClose={() => setReportingMessage(null)}
          onSubmit={() => setReportingMessage(null)}
        />
      )}
    </div>
  )
}

// Refined MessageBubble component to match Discord exactly
function MessageBubble({ message, onReaction, onBookmark, onReply, onReport }: any) {
  const [showActions, setShowActions] = useState(false)

  const renderEmbed = () => {
    if (message.embedType === "image" && message.image) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden max-w-[400px]">
          <img
            src={message.image || "/placeholder.svg"}
            alt="Shared content"
            className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
        </div>
      )
    }
    return null
  }

  return (
    <div
      className="flex space-x-3 group hover:bg-zinc-800/20 -mx-3 px-3 py-1 rounded transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-10 w-10 mt-0.5">
        <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm">
          {message.user.name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 max-w-[580px]">
        {/* Header with exact Discord styling */}
        <div className="flex items-baseline space-x-2 mb-1">
          <span className="font-bold text-white text-sm hover:underline cursor-pointer">{message.user.name}</span>
          <span className="text-xs text-zinc-500 font-medium">{message.timestamp}</span>

          {/* Always visible actions (like Discord) */}
          <div className="ml-auto flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 transition-colors ${
                message.bookmarked ? "text-yellow-400 hover:text-yellow-300" : "text-zinc-400 hover:text-white"
              }`}
              onClick={() => onBookmark(message.id)}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-zinc-400 hover:text-white">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-zinc-400 hover:text-white">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Message Content */}
        <div className="text-zinc-300 text-[15px] leading-[1.375] mb-1">
          <MessageWithMentions content={message.content} mentions={message.mentions} />
        </div>

        {/* Rich Media Embeds */}
        {renderEmbed()}

        {/* Discord-style Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`h-6 px-1.5 text-xs transition-all border ${
                  reaction.reacted
                    ? "bg-violet-600/20 border-violet-500/50 text-violet-300"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:border-zinc-600/50"
                }`}
                onClick={() => onReaction(message.id, reaction.emoji)}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Hover Actions */}
        {showActions && (
          <div className="absolute right-4 top-0 flex items-center space-x-1 bg-zinc-800 rounded border border-zinc-700 p-1 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400"
              onClick={() => onReaction(message.id, "❤️")}
            >
              <Heart className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-zinc-400 hover:text-blue-400"
              onClick={onReply}
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400"
              onClick={onReport}
            >
              <Flag className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
