"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Notification = {
  id: string
  user_id: string
  sender_id: string
  sender_username: string
  sender_avatar_url: string
  topic_id: string
  topic_title: string
  message_id: string
  message_content: string
  type: "mention" | "reply" | "reaction"
  is_read: boolean
  created_at: string
}

type UserStatus = {
  id: string
  username: string
  avatar_url: string
  is_online: boolean
  last_seen: string
}

type RealtimeContextType = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  onlineUsers: UserStatus[]
  activeTypingUsers: { [topicId: string]: string[] }
  startTyping: (topicId: string) => void
  stopTyping: (topicId: string) => void
}

const RealtimeContext = createContext<RealtimeContextType | null>(null)

export function RealtimeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const router = useRouter()
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [onlineUsers, setOnlineUsers] = useState<UserStatus[]>([])
  const [activeTypingUsers, setActiveTypingUsers] = useState<{ [topicId: string]: string[] }>({})
  
  const unreadCount = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    if (!user) return

    // Initialize user's online status
    const updateUserStatus = async () => {
      await supabase
        .from("user_status")
        .upsert({ 
          user_id: user.id, 
          is_online: true,
          last_seen: new Date().toISOString()
        })
    }
    
    updateUserStatus()

    // Set up real-time listeners
    const notificationsChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newNotification = payload.new as Notification
            setNotifications(prev => [newNotification, ...prev])
            
            // Show toast for new notification
            toast(
              <div className="flex items-center gap-2">
                <img 
                  src={newNotification.sender_avatar_url} 
                  alt={newNotification.sender_username}
                  className="w-8 h-8 rounded-full" 
                />
                <div>
                  <p className="font-medium">{newNotification.sender_username}</p>
                  <p className="text-sm text-gray-300 truncate">
                    {newNotification.type === "mention" ? "mentioned you" : 
                     newNotification.type === "reply" ? "replied to your message" : 
                     "reacted to your message"}
                  </p>
                </div>
              </div>
            )
          } else if (payload.eventType === "UPDATE") {
            const updatedNotification = payload.new as Notification
            setNotifications(prev => 
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            )
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id
            setNotifications(prev => prev.filter(n => n.id !== deletedId))
          }
        }
      )

    const userStatusChannel = supabase
      .channel("user_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_status",
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const userStatus = payload.new as UserStatus
            setOnlineUsers(prev => {
              const exists = prev.some(u => u.id === userStatus.id)
              if (exists) {
                return prev.map(u => u.id === userStatus.id ? userStatus : u)
              } else {
                return [...prev, userStatus]
              }
            })
          }
        }
      )

    const typingChannel = supabase
      .channel("typing")
      .on(
        "broadcast",
        { event: "typing" },
        (payload: { topicId: string; userId: string; username: string; isTyping: boolean }) => {
          if (payload.userId === user.id) return // Ignore our own typing events
          
          setActiveTypingUsers(prev => {
            const topicTypers = prev[payload.topicId] || []
            
            if (payload.isTyping) {
              // Add user to typing list if not already there
              if (!topicTypers.includes(payload.username)) {
                return {
                  ...prev,
                  [payload.topicId]: [...topicTypers, payload.username]
                }
              }
            } else {
              // Remove user from typing list
              return {
                ...prev,
                [payload.topicId]: topicTypers.filter(name => name !== payload.username)
              }
            }
            
            return prev
          })
        }
      )

    // Subscribe to channels
    notificationsChannel.subscribe()
    userStatusChannel.subscribe()
    typingChannel.subscribe()

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
      
      if (data) {
        setNotifications(data)
      }
    }
    
    // Fetch online users
    const fetchOnlineUsers = async () => {
      const { data } = await supabase
        .from("user_status")
        .select("id, username, avatar_url, is_online, last_seen")
        .eq("is_online", true)
      
      if (data) {
        setOnlineUsers(data)
      }
    }

    fetchNotifications()
    fetchOnlineUsers()

    // Update last seen every minute
    const lastSeenInterval = setInterval(() => {
      supabase
        .from("user_status")
        .upsert({ 
          user_id: user.id, 
          is_online: true,
          last_seen: new Date().toISOString()
        })
    }, 60000)

    // Set offline on page unload
    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        "/api/user-status",
        JSON.stringify({ 
          userId: user.id, 
          isOnline: false 
        })
      )
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Cleanup
    return () => {
      supabase.removeChannel(notificationsChannel)
      supabase.removeChannel(userStatusChannel)
      supabase.removeChannel(typingChannel)
      clearInterval(lastSeenInterval)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [supabase, user, router])

  const markAsRead = async (notificationId: string) => {
    if (!user) return
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    )
  }

  const markAllAsRead = async () => {
    if (!user) return
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)
    
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    )
  }

  const startTyping = (topicId: string) => {
    if (!user) return
    
    supabase
      .channel("typing")
      .send({
        type: "broadcast",
        event: "typing",
        payload: {
          topicId,
          userId: user.id,
          username: user.username,
          isTyping: true
        }
      })
  }

  const stopTyping = (topicId: string) => {
    if (!user) return
    
    supabase
      .channel("typing")
      .send({
        type: "broadcast",
        event: "typing",
        payload: {
          topicId,
          userId: user.id,
          username: user.username,
          isTyping: false
        }
      })
  }

  return (
    <RealtimeContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        onlineUsers,
        activeTypingUsers,
        startTyping,
        stopTyping
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
