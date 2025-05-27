"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  ChevronDown,
  ChevronUp,
  Users,
  Menu,
  Clock,
  X,
  LayoutGrid,
} from "lucide-react"
import { CircleRadar } from "./circle-radar"
import { ReportMessageModal } from "./report-message-modal"
import { MessageWithMentions } from "./message-with-mentions"
import { EnhancedMessageComposer } from "./enhanced-message-composer"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LeftSidebar } from "./left-sidebar"
import Link from "next/link"

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

// Daily topic data
const DAILY_TOPICS = [
  {
    id: "1",
    title: "Who's better: The Beatles or The Stones?",
    participantCount: 42,
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000 + 32 * 60 * 1000), // 18h 32m from now
  },
  {
    id: "2",
    title:
      "Could John Wick kill the Predator if he had access to all his weapons and the fight took place in the Continental Hotel?",
    participantCount: 28,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from now
  },
  {
    id: "3",
    title: "Is cereal soup?",
    participantCount: 56,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from now
  },
]

export function CircleChat() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [bookmarkedMessages, setBookmarkedMessages] = useState<any[]>([])
  const [expiredBookmarks, setExpiredBookmarks] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [messageMentions, setMessageMentions] = useState<any[]>([])
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [reportingMessage, setReportingMessage] = useState<any>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(DAILY_TOPICS[0])
  const [timeRemaining, setTimeRemaining] = useState("")
  const [showRadarOnMobile, setShowRadarOnMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Calculate time remaining and handle expiration
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const diff = currentTopic.expiresAt.getTime() - now.getTime()

      if (diff <= 0) {
        // Handle expiration
        handleTopicExpiration()
        return "00:00:00"
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
    }

    setTimeRemaining(calculateTimeRemaining())

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTopic])

  // Handle topic expiration
  const handleTopicExpiration = () => {
    // Save bookmarked messages before clearing
    const bookmarked = messages.filter((msg) => msg.bookmarked)

    // Add bookmarked messages to expired bookmarks
    if (bookmarked.length > 0) {
      setExpiredBookmarks((prev) => [
        ...prev,
        ...bookmarked.map((msg) => ({
          ...msg,
          expiredTopic: currentTopic.title,
          expiredAt: new Date(),
        })),
      ])
    }

    // Clear all messages
    setMessages([])

    // Get next topic (in a real app, this would fetch from API)
    const nextTopicIndex = (DAILY_TOPICS.findIndex((t) => t.id === currentTopic.id) + 1) % DAILY_TOPICS.length
    setCurrentTopic({
      ...DAILY_TOPICS[nextTopicIndex],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Reset to 24h from now
    })
  }

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
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const newBookmarked = !msg.bookmarked

          // Update bookmarked messages collection
          if (newBookmarked) {
            setBookmarkedMessages((prevBookmarks) => [...prevBookmarks, msg])
          } else {
            setBookmarkedMessages((prevBookmarks) => prevBookmarks.filter((bm) => bm.id !== msg.id))
          }

          return { ...msg, bookmarked: newBookmarked }
        }
        return msg
      }),
    )
  }

  const toggleHeaderCollapse = () => {
    setIsHeaderCollapsed(!isHeaderCollapsed)
  }

  const toggleRadarOnMobile = () => {
    setShowRadarOnMobile(!showRadarOnMobile)
  }

  return (
    <div className="flex h-full bg-zinc-900">
      {/* Mobile Sidebar Trigger */}
      <div className="fixed top-0 left-0 z-50 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="m-2 bg-zinc-800/80 backdrop-blur-sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] bg-zinc-900 border-zinc-700">
            <LeftSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Daily Topic Header - Sticky with gradient and collapsible */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-700/50 shadow-sm">
          <div className="max-w-[580px] mx-auto px-4 md:px-6">
            <div className={`transition-all duration-200 ease-in-out ${isHeaderCollapsed ? "py-2" : "py-4"}`}>
              <div className="flex items-center justify-between">
                <div className={`flex-1 transition-all duration-200 ${isHeaderCollapsed ? "max-w-[70%]" : ""}`}>
                  {!isHeaderCollapsed && <h1 className="text-white font-semibold text-lg mb-1">Today's Circle</h1>}
                  <p className={`text-zinc-200 ${isHeaderCollapsed ? "text-sm truncate" : "text-base"}`}>
                    {currentTopic.title}
                  </p>

                  {!isHeaderCollapsed && (
                    <div className="flex items-center mt-2 text-xs text-zinc-400">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Expires in {timeRemaining}</span>
                      </div>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{currentTopic.participantCount} participants</span>
                      </div>
                    </div>
                  )}
                </div>

                {isHeaderCollapsed && (
                  <div className="flex items-center text-xs text-zinc-400 mr-2">
                    <div className="flex items-center mr-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{timeRemaining}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{currentTopic.participantCount}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  {/* Mobile Radar Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 md:hidden mr-1"
                    onClick={toggleRadarOnMobile}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>

                  {/* Collapse Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={toggleHeaderCollapse}
                  >
                    {isHeaderCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages - Tighter spacing to match Discord */}
          <div className={`flex-1 overflow-y-auto px-4 md:px-6 py-4 ${showRadarOnMobile ? "hidden sm:block" : ""}`}>
            <div className="max-w-[580px] mx-auto space-y-3">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onReaction={handleReaction}
                    onBookmark={toggleBookmark}
                    onReply={() => setReplyTo(message.id)}
                    onReport={() => setReportingMessage(message)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-400">No messages yet. Start the conversation!</p>
                </div>
              )}

              {/* Expired Bookmarks Section */}
              {expiredBookmarks.length > 0 && (
                <div className="mt-8 border-t border-zinc-800 pt-4">
                  <h3 className="text-zinc-300 font-medium mb-3">Bookmarked Messages from Previous Circles</h3>
                  <div className="space-y-3">
                    {expiredBookmarks.map((bookmark) => (
                      <ExpiredBookmarkMessage key={bookmark.id} message={bookmark} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Mobile Radar Panel (conditionally shown) */}
          <div
            className={`w-full sm:w-80 border-l border-zinc-700/50 bg-zinc-900/50 ${showRadarOnMobile ? "block" : "hidden"} sm:hidden`}
          >
            <div className="flex justify-between items-center p-2 border-b border-zinc-700/50">
              <h3 className="text-zinc-200 font-medium">Radar</h3>
              <Button variant="ghost" size="sm" onClick={toggleRadarOnMobile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CircleRadar />
          </div>
        </div>

        {/* Enhanced Message Composer */}
        <div className="border-t border-zinc-700/50 bg-zinc-900/95">
          <div className="max-w-[580px] mx-auto px-4 md:px-6 py-4">
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

      {/* Right Sidebar - Radar Panel (desktop only) */}
      <div className="w-80 border-l border-zinc-700/50 bg-zinc-900/50 hidden md:block">
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
            id: currentTopic.id,
            title: currentTopic.title,
            date: new Date().toLocaleDateString(),
            expiresAt: currentTopic.expiresAt,
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
      className="flex space-x-3 group hover:bg-zinc-800/20 -mx-3 px-3 py-1 rounded transition-colors relative"
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

// Component for expired bookmarked messages
function ExpiredBookmarkMessage({ message }: { message: any }) {
  return (
    <div className="flex space-x-3 bg-zinc-800/20 rounded-lg p-3 border border-zinc-700/30">
      <Avatar className="h-10 w-10 mt-0.5">
        <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm">
          {message.user.name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-baseline space-x-2 mb-1">
          <Link href={`/profile/${message.user.username}`} className="font-bold text-white text-sm hover:underline">
            {message.user.name}
          </Link>
          <span className="text-xs text-zinc-500 font-medium">{new Date(message.expiredAt).toLocaleDateString()}</span>
        </div>

        <div className="text-zinc-400 text-sm italic border-l-2 border-zinc-600 pl-3 py-1">
          This message was part of a previous Circle and has expired.
        </div>

        <div className="mt-2 text-xs text-zinc-500">
          <span>From topic: </span>
          <span className="text-zinc-400">{message.expiredTopic}</span>
        </div>
      </div>
    </div>
  )
}
