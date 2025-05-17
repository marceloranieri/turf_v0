"use client"

import { useState, useEffect, useRef } from "react"
import { useTopics } from "@/context/topics-context"
import { useAuth } from "@/context/auth-context"
import { useRealtime } from "@/context/realtime-context"
import { useSupabase } from "@/lib/supabase-provider"
import { useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Image as ImageIcon,
  Smile,
  SendHorizontal,
  MoreVertical,
  X,
  Reply
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import debounce from "lodash/debounce"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  image_url?: string
  user_id: string
  user: {
    id: string
    username: string
    avatar_url: string
    is_online: boolean
  }
  created_at: string
  parent_id: string | null
  reactions: {
    emoji: string
    count: number
  }[]
  replies?: Message[]
  upvotes: number
  downvotes: number
  userVote?: "up" | "down" | null
}

type Topic = {
  id: string
  title: string
  description: string
  created_at: string
  user_id: string
  user: {
    username: string
    avatar_url: string
  }
}

type TopicDetailRealtimeProps = {
  topicId: string
  initialMessages?: Message[]
}

export function TopicDetailRealtime({ topicId, initialMessages = [] }: TopicDetailRealtimeProps) {
  const { fetchTopic, fetchMessages, createMessage, voteMessage, addReaction } = useTopics()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const { activeTypingUsers, startTyping, stopTyping } = useRealtime()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const highlightedMessageId = searchParams.get("highlight")
  
  const [topic, setTopic] = useState<Topic | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingRef = useRef<NodeJS.Timeout | null>(null)
  
  // Topic typing users
  const typingUsers = activeTypingUsers[topicId] || []

  // Initial data loading
  useEffect(() => {
    const loadTopicData = async () => {
      setIsLoading(true)
      
      // Fetch topic details
      const topicData = await fetchTopic(topicId)
      if (topicData) {
        setTopic(topicData)
      }
      
      // Fetch messages
      const messagesData = await fetchMessages(topicId)
      if (messagesData) {
        setMessages(messagesData)
      }
      
      setIsLoading(false)
      
      // Scroll to highlighted message if any
      if (highlightedMessageId) {
        setTimeout(() => {
          const element = document.getElementById(`message-${highlightedMessageId}`)
          if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            element.classList.add("bg-blue-800/20")
            setTimeout(() => {
              element.classList.remove("bg-blue-800/20")
            }, 3000)
          }
        }, 500)
      } else {
        // Otherwise scroll to bottom
        scrollToBottom()
      }
    }
    
    loadTopicData()
  }, [topicId, fetchTopic, fetchMessages, highlightedMessageId])
  
  // Setup real-time subscriptions
  useEffect(() => {
    if (!supabase) return
    
    const messagesChannel = supabase
      .channel(`messages:${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `topic_id=eq.${topicId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch the complete message with user and reactions
            const { data } = await supabase
              .from("messages")
              .select(`
                *,
                user:user_id (
                  id,
                  username,
                  avatar_url,
                  is_online
                ),
                reactions:message_reactions (
                  emoji,
                  count
                )
              `)
              .eq("id", payload.new.id)
              .single()
            
            if (data) {
              const newMsg = data as unknown as Message
              
              // Handle parent-child relationship
              if (newMsg.parent_id) {
                // This is a reply, add it to the parent message
                setMessages(prev => 
                  prev.map(msg => {
                    if (msg.id === newMsg.parent_id) {
                      return {
                        ...msg,
                        replies: [...(msg.replies || []), newMsg]
                      }
                    }
                    return msg
                  })
                )
              } else {
                // This is a top-level message
                setMessages(prev => [...prev, newMsg])
                scrollToBottom()
              }
            }
          } else if (payload.eventType === "UPDATE") {
            // Handle message updates
            setMessages(prev => {
              return prev.map(msg => {
                if (msg.id === payload.new.id) {
                  return { ...msg, ...payload.new }
                }
                
                // Check in replies too
                if (msg.replies) {
                  return {
                    ...msg,
                    replies: msg.replies.map(reply => 
                      reply.id === payload.new.id 
                        ? { ...reply, ...payload.new }
                        : reply
                    )
                  }
                }
                
                return msg
              })
            })
          } else if (payload.eventType === "DELETE") {
            // Handle message deletion
            setMessages(prev => {
              // Remove from top-level messages
              const filteredMessages = prev.filter(msg => msg.id !== payload.old.id)
              
              // Remove from replies
              return filteredMessages.map(msg => {
                if (msg.replies) {
                  return {
                    ...msg,
                    replies: msg.replies.filter(reply => reply.id !== payload.old.id)
                  }
                }
                return msg
              })
            })
          }
        }
      )
      
    const reactionsChannel = supabase
      .channel(`reactions:${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
        },
        (payload) => {
          if (!payload.new.message_id) return
          
          setMessages(prev => {
            // Update the reactions for the specified message
            return prev.map(msg => {
              if (msg.id === payload.new.message_id) {
                // Create a new reactions array
                const updatedReactions = [...(msg.reactions || [])].filter(
                  r => r.emoji !== payload.new.emoji
                )
                
                if (payload.eventType !== "DELETE") {
                  updatedReactions.push({
                    emoji: payload.new.emoji,
                    count: payload.new.count
                  })
                }
                
                return { ...msg, reactions: updatedReactions }
              }
              
              // Check in replies too
              if (msg.replies) {
                return {
                  ...msg,
                  replies: msg.replies.map(reply => {
                    if (reply.id === payload.new.message_id) {
                      const updatedReactions = [...(reply.reactions || [])].filter(
                        r => r.emoji !== payload.new.emoji
                      )
                      
                      if (payload.eventType !== "DELETE") {
                        updatedReactions.push({
                          emoji: payload.new.emoji,
                          count: payload.new.count
                        })
                      }
                      
                      return { ...reply, reactions: updatedReactions }
                    }
                    return reply
                  })
                }
              }
              
              return msg
            })
          })
        }
      )
      
    const votesChannel = supabase
      .channel(`votes:${topicId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_votes",
        },
        async (payload) => {
          if (!payload.new && !payload.old) return
          
          const messageId = payload.new?.message_id || payload.old?.message_id
          
          // Fetch updated vote counts
          const { data } = await supabase.rpc("get_message_votes", {
            message_id: messageId
          })
          
          if (data) {
            setMessages(prev => {
              return prev.map(msg => {
                if (msg.id === messageId) {
                  return { 
                    ...msg, 
                    upvotes: data.upvotes,
                    downvotes: data.downvotes,
                    userVote: user?.id === payload.new?.user_id 
                      ? payload.new?.is_upvote ? "up" : "down"
                      : msg.userVote
                  }
                }
                
                // Check in replies too
                if (msg.replies) {
                  return {
                    ...msg,
                    replies: msg.replies.map(reply => 
                      reply.id === messageId
                        ? { 
                            ...reply, 
                            upvotes: data.upvotes,
                            downvotes: data.downvotes,
                            userVote: user?.id === payload.new?.user_id 
                              ? payload.new?.is_upvote ? "up" : "down"
                              : reply.userVote
                          }
                        : reply
                    )
                  }
                }
                
                return msg
              })
            })
          }
        }
      )

    // Subscribe to all channels
    messagesChannel.subscribe()
    reactionsChannel.subscribe()
    votesChannel.subscribe()

    // Cleanup
    return () => {
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(reactionsChannel)
      supabase.removeChannel(votesChannel)
    }
  }, [supabase, topicId, user])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    
    // Handle typing indicators
    if (e.target.value.trim() !== "") {
      if (typingRef.current) {
        clearTimeout(typingRef.current)
      } else {
        startTyping(topicId)
      }
      
      typingRef.current = setTimeout(() => {
        stopTyping(topicId)
        typingRef.current = null
      }, 3000)
    } else if (typingRef.current) {
      clearTimeout(typingRef.current)
      stopTyping(topicId)
      typingRef.current = null
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!user) return null
    
    setIsUploadingImage(true)
    
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `message-images/${fileName}`
      
      // Upload image to storage
      const { error: uploadError } = await supabase
        .storage
        .from("public")
        .upload(filePath, file)
      
      if (uploadError) {
        throw uploadError
      }
      
      // Get public URL
      const { data } = supabase
        .storage
        .from("public")
        .getPublicUrl(filePath)
      
      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        variant: "destructive",
        title: "Error uploading image",
        description: "Failed to upload image. Please try again."
      })
      return null
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Images must be less than 5MB"
      })
      return
    }
    
    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImageSelection = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || isSubmitting || (!newMessage.trim() && !imageFile)) return
    
    setIsSubmitting(true)
    
    try {
      let imageUrl: string | undefined
      
      // Upload image if any
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }
      
      // Create message
      await createMessage(
        topicId,
        newMessage.trim(),
        imageUrl,
        replyTo?.id
      )
      
      // Reset form
      setNewMessage("")
      setReplyTo(null)
      clearImageSelection()
      
      // Stop typing indicator
      if (typingRef.current) {
        clearTimeout(typingRef.current)
        stopTyping(topicId)
        typingRef.current = null
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (messageId: string, isUpvote: boolean) => {
    if (!user) return
    
    try {
      await voteMessage(messageId, isUpvote)
    } catch (error) {
      console.error("Error voting on message:", error)
      toast({
        variant: "destructive",
        title: "Failed to vote",
        description: "Please try again later"
      })
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return
    
    try {
      await addReaction(messageId, emoji)
      setShowEmojiPicker(false)
    } catch (error) {
      console.error("Error adding reaction:", error)
      toast({
        variant: "destructive",
        title: "Failed to add reaction",
        description: "Please try again later"
      })
    }
  }

  const handleEmojiSelect = (emojiData: EmojiClickData, event: MouseEvent) => {
    if (showEmojiPicker) {
      const messageId = showEmojiPicker === true ? "" : showEmojiPicker
      if (messageId) {
        handleReaction(messageId, emojiData.emoji)
      } else {
        // Insert emoji into message text
        setNewMessage(prev => prev + emojiData.emoji)
      }
      setShowEmojiPicker(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-1/2 h-6" />
        
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="w-32 h-5 mb-2" />
                <Skeleton className="w-full h-16" />
              </div>
            </div>
          ))}
        </div>
        
        <Skeleton className="w-full h-24" />
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Topic not found</h2>
          <p className="text-gray-400 mt-2">This topic may have been deleted or you don't have access to it.</p>
        </div>
      </div>
    )
  }

  // Render message component
  const renderMessage = (message: Message, isReply = false) => (
    <div 
      id={`message-${message.id}`}
      key={message.id}
      className={`
        flex items-start gap-3 p-3 rounded-lg transition-colors duration-300
        ${isReply ? "ml-12 bg-neutral-900/50" : "bg-neutral-900"}
      `}
    >
      <Avatar
        src={message.user.avatar_url}
        alt={message.user.username}
        size="md"
        status={message.user.is_online ? "online" : "offline"}
      >
        <AvatarFallback>
          {message.user.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.user.username}</span>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <div className="mt-1 break-words">{message.content}</div>
        
        {message.image_url && (
          <div className="mt-2">
            <img 
              src={message.image_url} 
              alt="Attached image" 
              className="rounded-md max-h-80 object-contain bg-neutral-800"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          {/* Vote buttons */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${message.userVote === "up" ? "text-green-500" : ""}`}
              onClick={() => handleVote(message.id, true)}
            >
              <ArrowUp size={16} />
            </Button>
            <span className="text-sm mx-1">
              {(message.upvotes || 0) - (message.downvotes || 0)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${message.userVote === "down" ? "text-red-500" : ""}`}
              onClick={() => handleVote(message.id, false)}
            >
              <ArrowDown size={16} />
            </Button>
          </div>
          
          {/* Reply button */}
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setReplyTo(message)}
            >
              <MessageSquare size={16} className="mr-1" />
              Reply
            </Button>
          )}
          
          {/* Reaction button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowEmojiPicker(message.id)}
            >
              <Smile size={16} className="mr-1" />
              React
            </Button>
          </div>
          
          {/* Message actions */}
          {user?.id === message.user_id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neutral-800 text-white border-gray-700">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {/* Reactions display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction) => (
              <div
                key={reaction.emoji}
                className={cn(
                  "flex items-center bg-neutral-800 rounded-full px-2 py-1 text-sm",
                  reaction.emoji === "👍" && user?.id === reaction.emoji && "bg-green-500 text-green-50"
                )}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span className="text-xs">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Replies */}
        {!isReply && message.replies && message.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {message.replies.map((reply) => renderMessage(reply, true))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Topic header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">{topic?.title}</h1>
        <p className="text-gray-400 mt-1">{topic?.description}</p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                id={message.id}
                className={`flex gap-3 ${
                  message.id === highlightedMessageId
                    ? "bg-blue-900/20 rounded-lg p-2"
                    : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.user.avatar_url} />
                  <AvatarFallback>
                    {message.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.user.username}</span>
                    <span className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="mt-1">
                    {message.parent_id && (
                      <div className="text-sm text-gray-400 mb-1">
                        Replying to{" "}
                        {messages.find((m) => m.id === message.parent_id)?.user
                          .username || "Unknown"}
                      </div>
                    )}
                    <p className="text-gray-200 whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.image_url && (
                      <div className="mt-2">
                        <img
                          src={message.image_url}
                          alt="Message attachment"
                          className="max-w-sm rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(
                        message.reactions.reduce((acc, reaction) => {
                          acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      ).map(([emoji, count]) => (
                        <div
                          key={emoji}
                          className="flex items-center gap-1 bg-gray-800 rounded-full px-2 py-1 text-sm"
                        >
                          <span>{emoji}</span>
                          <span className="text-gray-400">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(message.id, true)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ArrowUp className="h-4 w-4 mr-1" />
                      {message.upvotes || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(message.id, false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ArrowDown className="h-4 w-4 mr-1" />
                      {message.downvotes || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(message)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmojiPicker(message.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Smile className="h-4 w-4 mr-1" />
                      React
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-400">
          {typingUsers.map((user) => user.username).join(", ")} typing...
        </div>
      )}

      {/* Message form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={clearImageSelection}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={newMessage}
              onChange={handleMessageChange}
              placeholder={replyTo ? `Reply to ${replyTo.user.username}...` : "Type a message..."}
              className="min-h-[100px] bg-neutral-800 border-gray-700 resize-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2"
              onClick={() => setShowEmojiPicker(true)}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <Button type="submit" disabled={isSubmitting || isUploadingImage}>
              {isSubmitting || isUploadingImage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {replyTo && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <span>Replying to {replyTo.user.username}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyTo(null)}
              className="h-6 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </form>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div 
          className="absolute bottom-[170px] right-4 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
              width={300}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  )
}
