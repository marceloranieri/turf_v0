"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { useRealtime } from "@/context/realtime-context"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtime()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = async (
    notificationId: string,
    topicId: string,
    messageId?: string
  ) => {
    await markAsRead(notificationId)
    setIsOpen(false)
    
    const url = messageId 
      ? `/topics/${topicId}?highlight=${messageId}` 
      : `/topics/${topicId}`
      
    router.push(url)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full p-0 h-10 w-10"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-neutral-900 text-white border-gray-700">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="font-medium">Notifications</h3>
          {notifications.some(n => !n.is_read) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No notifications yet
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`
                    p-3 border-b border-gray-700 hover:bg-neutral-800 cursor-pointer
                    ${!notification.is_read ? "bg-neutral-800/50" : ""}
                  `}
                  onClick={() => 
                    handleNotificationClick(
                      notification.id, 
                      notification.topic_id,
                      notification.message_id
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={notification.sender_avatar_url} 
                      alt={notification.sender_username}
                      className="w-10 h-10 rounded-full" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{notification.sender_username}</p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {notification.type === "mention" && "mentioned you in "}
                        {notification.type === "reply" && "replied to your message in "}
                        {notification.type === "reaction" && "reacted to your message in "}
                        <span className="font-medium">{notification.topic_title}</span>
                      </p>
                      {notification.message_content && (
                        <p className="mt-1 text-sm text-gray-400 truncate">
                          {notification.message_content}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
