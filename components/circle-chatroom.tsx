"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleRadar } from "@/components/circle-radar"
import { UrlPreview } from "@/components/url-preview"
import { GifPicker } from "@/components/gif-picker"
import { useGiphy } from "@/app/hooks/useGiphy"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ImageIcon,
  Smile,
  Send,
  Bookmark,
  BookmarkCheck,
  Reply,
  Flag,
  Menu,
  Users,
  X,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock data for messages
const MOCK_MESSAGES = [
  {
    id: "1",
    content:
      "Has anyone listened to the new Beatles anthology? I think it really shows why they're superior to the Stones in terms of musical innovation.",
    sender: {
      id: "user1",
      name: "John",
      avatar: "/placeholder.svg?height=128&width=128&text=J",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "❤️", count: 2 },
    ],
  },
  {
    id: "2",
    content: "The Stones have longevity though. They're still touring while the Beatles broke up decades ago.",
    sender: {
      id: "user2",
      name: "Mick",
      avatar: "/placeholder.svg?height=128&width=128&text=M",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    reactions: [{ emoji: "🔥", count: 5 }],
  },
  {
    id: "3",
    content:
      "Check out this performance from the Stones. Their energy is unmatched! https://www.youtube.com/watch?v=qUlOyj9F5gM",
    sender: {
      id: "user3",
      name: "Keith",
      avatar: "/placeholder.svg?height=128&width=128&text=K",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    reactions: [],
  },
  {
    id: "4",
    content: "Beatles had more #1 hits though. Their songwriting was revolutionary.",
    sender: {
      id: "user4",
      name: "Paul",
      avatar: "/placeholder.svg?height=128&width=128&text=P",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    reactions: [{ emoji: "👏", count: 4 }],
    image: "/placeholder.svg?height=600&width=800&text=Beatles+Album+Cover",
  },
  {
    id: "5",
    content:
      "I think they're both great in different ways. Beatles were more innovative in the studio, but the Stones had that raw rock energy that's hard to beat.",
    sender: {
      id: "user5",
      name: "Ringo",
      avatar: "/placeholder.svg?height=128&width=128&text=R",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    reactions: [{ emoji: "💯", count: 7 }],
  },
]

// Mock data for expired bookmarked messages
const MOCK_EXPIRED_BOOKMARKS = [
  {
    id: "exp1",
    originalContent: "This message was part of a previous Circle and has expired.",
    sender: {
      id: "user6",
      name: "George",
      avatar: "/placeholder.svg?height=128&width=128&text=G",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
    topic: "What's the best Beatles album?",
    expiredAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: "exp2",
    originalContent: "This message was part of a previous Circle and has expired.",
    sender: {
      id: "user7",
      name: "Charlie",
      avatar: "/placeholder.svg?height=128&width=128&text=C",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
    topic: "Are the Stones better live than in studio?",
    expiredAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
]

export function CircleChatroom() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [expiredBookmarks, setExpiredBookmarks] = useState(MOCK_EXPIRED_BOOKMARKS)
  const [inputValue, setInputValue] = useState("")
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [bookmarkedMessages, setBookmarkedMessages] = useState<string[]>([])
  const [showRadarOnMobile, setShowRadarOnMobile] = useState(false)
  const [expirationTime, setExpirationTime] = useState(24 * 60 * 60) // 24 hours in seconds
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { gifs, searchGifs, isSearching } = useGiphy()

  // Format the expiration time as HH:MM:SS
  const formatExpirationTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setExpirationTime((prev) => {
        if (prev <= 1) {
          // Reset the timer and clear messages when it reaches zero
          clearMessages()
          return 24 * 60 * 60 // Reset to 24 hours
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Toggle bookmark for a message
  const toggleBookmark = (messageId: string) => {
    if (bookmarkedMessages.includes(messageId)) {
      setBookmarkedMessages(bookmarkedMessages.filter((id) => id !== messageId))
    } else {
      setBookmarkedMessages([...bookmarkedMessages, messageId])
    }
  }

  // Clear all messages and create expired bookmarks
  const clearMessages = () => {
    // Create expired bookmarks for bookmarked messages
    const newExpiredBookmarks = messages
      .filter((message) => bookmarkedMessages.includes(message.id))
      .map((message) => ({
        id: `exp-${message.id}`,
        originalContent: "This message was part of a previous Circle and has expired.",
        sender: message.sender,
        timestamp: message.timestamp,
        topic: "Who's better: The Beatles or The Stones?",
        expiredAt: new Date(),
      }))

    setExpiredBookmarks([...newExpiredBookmarks, ...expiredBookmarks])
    setMessages([])
    setBookmarkedMessages([])
  }

  // Send a new message
  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        content: inputValue,
        sender: {
          id: "currentUser",
          name: "You",
          avatar: "/placeholder.svg?height=128&width=128&text=You",
        },
        timestamp: new Date(),
        reactions: [],
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Extract URLs from message content
  const extractUrls = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return content.match(urlRegex) || []
  }

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Sticky Topic Header */}
        <div
          className={`sticky top-0 z-10 transition-all duration-300 ease-in-out ${isHeaderCollapsed ? "py-2" : "py-4"}`}
        >
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 border-b border-zinc-700/50 shadow-sm px-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {isHeaderCollapsed ? (
                  <div className="flex items-center">
                    <h1 className="text-lg font-semibold truncate">Who's better: The Beatles or The Stones?</h1>
                    <Badge variant="outline" className="ml-2 bg-zinc-800/80 text-zinc-300 border-zinc-700">
                      {formatExpirationTime(expirationTime)}
                    </Badge>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-1">Who's better: The Beatles or The Stones?</h1>
                    <div className="flex items-center text-sm text-zinc-400">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>42 participants</span>
                      </div>
                      <div className="mx-2">•</div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Expires in {formatExpirationTime(expirationTime)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              >
                {isHeaderCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && expiredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Be the first to start the conversation!</p>
            </div>
          ) : (
            <>
              {/* Expired Bookmarked Messages */}
              {expiredBookmarks.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs uppercase text-zinc-500 font-semibold mb-2 px-2">
                    Bookmarked from previous Circles
                  </div>
                  {expiredBookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="mb-3 bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-3">
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
                          <AvatarImage src={bookmark.sender.avatar || "/placeholder.svg"} alt={bookmark.sender.name} />
                          <AvatarFallback>{bookmark.sender.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium text-[13px] text-violet-400">{bookmark.sender.name}</span>
                            <span className="text-xs text-zinc-500 ml-2">
                              {formatDistanceToNow(bookmark.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 italic">{bookmark.originalContent}</p>
                          <div className="mt-1 text-xs text-zinc-500">
                            <span>From topic: </span>
                            <span className="text-zinc-400">{bookmark.topic}</span>
                            <span className="mx-1">•</span>
                            <span>Expired: {formatDistanceToNow(bookmark.expiredAt, { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-b border-zinc-800/50 my-4"></div>
                </div>
              )}

              {/* Current Messages */}
              {messages.map((message) => (
                <div key={message.id} className="group">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                      <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="font-medium text-[13px] text-violet-400">{message.sender.name}</span>
                        <span className="text-xs text-zinc-500 ml-2">
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-200 mt-1">{message.content}</p>

                      {/* Image attachment */}
                      {message.image && (
                        <div className="mt-2 max-w-[400px] sm:max-w-[280px] md:max-w-[400px]">
                          <div className="relative rounded-md overflow-hidden bg-zinc-800/50">
                            <img
                              src={message.image || "/placeholder.svg"}
                              alt="Shared image"
                              className="w-full h-auto object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}

                      {/* URL Preview */}
                      {extractUrls(message.content).map((url, index) => (
                        <div key={index} className="mt-2 max-w-[400px] sm:max-w-[280px] md:max-w-[400px]">
                          <UrlPreview url={url} />
                        </div>
                      ))}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700/50 text-xs py-0 h-6"
                            >
                              {reaction.emoji} {reaction.count}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Reply className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reply</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleBookmark(message.id)}
                            >
                              {bookmarkedMessages.includes(message.id) ? (
                                <BookmarkCheck className="h-4 w-4 text-violet-400" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {bookmarkedMessages.includes(message.id) ? "Unbookmark" : "Bookmark"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Flag className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Report</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Composer */}
        <div className="p-4 border-t border-zinc-800/50">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden">
              <div className="flex items-center p-2">
                <Input
                  placeholder="Send a message..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  maxLength={300}
                />
              </div>
              <div className="flex items-center justify-between px-2 py-1 border-t border-zinc-700/50">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <GifPicker onGifSelect={(gif) => setInputValue((prev) => prev + " " + gif.url)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-zinc-500">{inputValue.length}/300</div>
              </div>
            </div>
            <Button size="icon" onClick={sendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden fixed bottom-20 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="default"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={() => setShowRadarOnMobile(!showRadarOnMobile)}
        >
          {showRadarOnMobile ? <X className="h-4 w-4" /> : <Users className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {/* Sidebar content would go here */}
            <div className="p-4 border-b border-zinc-800/50">
              <h2 className="font-semibold">Turf</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-zinc-400">Sidebar navigation would go here</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Radar Sidebar - Hidden on mobile unless toggled */}
      <div
        className={`w-80 border-l border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80 overflow-hidden transition-all duration-300 ease-in-out ${
          showRadarOnMobile ? "fixed inset-y-0 right-0 z-30 w-full sm:w-80" : "hidden md:block"
        }`}
      >
        <CircleRadar />
      </div>
    </div>
  )
}
