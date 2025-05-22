"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { useRealtime } from "@/context/realtime-context"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export function NotificationBell() {
  const { user } = useAuth()
  const { setupNotificationSubscription } = useRealtime()
  const supabase = useSupabaseClient()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch notifications on mount
  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          sender:sender_id (
            username,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching notifications:", error)
        return
      }

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.read).length || 0)
    }

    fetchNotifications()

    // Set up real-time subscription
    const unsubscribe = setupNotificationSubscription((payload) => {
      if (payload.eventType === "INSERT") {
        // Fetch the new notification with sender data
        supabase
          .from("notifications")
          .select(`
            *,
            sender:sender_id (
              username,
              avatar_url
            )
          `)
          .eq("id", payload.new.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching new notification:", error)
              return
            }

            if (data) {
              setNotifications((prev) => [data, ...prev])
              setUnreadCount((prev) => prev + 1)
            }
          })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, setupNotificationSubscription, supabase])

  const markAsRead = async (id: string) => {
    if (!user) return

    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

    if (error) {
      console.error("Error marking notification as read:", error)
      return
    }

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => prev - 1)
  }

  const markAllAsRead = async () => {
    if (!user) return

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-red-500 text-white"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-zinc-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start p-3 cursor-default ${!notification.read ? "bg-zinc-800/50" : ""}`}
              onClick={() => markAsRead(notification.id)}
            >
              <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
                <AvatarImage src={notification.sender?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{notification.sender?.username?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{notification.sender?.username || "Someone"}</span>{" "}
                  <span>{notification.content}</span>
                </p>
                <p className="text-xs text-zinc-500 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!notification.read && <div className="h-2 w-2 bg-violet-500 rounded-full flex-shrink-0 mt-1"></div>}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
