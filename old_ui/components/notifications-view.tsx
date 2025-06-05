"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { Heart, MessageSquare, RefreshCw, UserPlus, Bell, Settings } from "lucide-react"

// Mock notification data
const ALL_NOTIFICATIONS = [
  {
    id: 1,
    type: "follow",
    users: [
      { id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" },
      { id: 2, name: "Moyo Shiro", avatar: "/diverse-group-avatars.png" },
      { id: 3, name: "Dash", avatar: "/diverse-group-avatars.png" },
      { id: 4, name: "Taylor", avatar: "/diverse-group-avatars.png" },
      { id: 5, name: "Riley", avatar: "/diverse-group-avatars.png" },
    ],
    action: "follow you",
    time: "3h ago",
    isRead: false,
  },
  {
    id: 2,
    type: "like",
    users: [{ id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" }],
    action: "liked your post",
    content: {
      type: "post",
      title: "SimpleList",
      link: "link.com/media.png",
    },
    time: "3h ago",
    isRead: false,
  },
  {
    id: 3,
    type: "repost",
    users: [{ id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" }],
    action: "reposted your post",
    content: {
      type: "post",
      title: "SimpleList",
      link: "link.com/media.png",
    },
    time: "3h ago",
    isRead: false,
  },
  {
    id: 4,
    type: "comment",
    users: [{ id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" }],
    action: "commented on your post",
    content: {
      type: "comment",
      text: "Always amazed with how you present your work. Love it so much",
    },
    time: "3h ago",
    isRead: true,
  },
  {
    id: 5,
    type: "like",
    users: [{ id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" }],
    action: "liked your post",
    content: {
      type: "post",
      title: "SimpleList",
      link: "link.com/media.png",
    },
    time: "3h ago",
    isRead: true,
  },
  {
    id: 6,
    type: "follow",
    users: [
      { id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" },
      { id: 2, name: "Moyo Shiro", avatar: "/diverse-group-avatars.png" },
      { id: 3, name: "Dash", avatar: "/diverse-group-avatars.png" },
    ],
    action: "follow you",
    time: "3h ago",
    isRead: true,
  },
  {
    id: 7,
    type: "repost",
    users: [{ id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" }],
    action: "reposted your post",
    content: {
      type: "post",
      title: "SimpleList",
      link: "link.com/media.png",
    },
    time: "3h ago",
    isRead: true,
  },
  {
    id: 8,
    type: "comment",
    users: [{ id: 1, name: "Kohaku", avatar: "/diverse-group-avatars.png" }],
    action: "commented on your post",
    content: {
      type: "comment",
      text: "Always amazed with how you present your work. Love it so much",
    },
    time: "3h ago",
    isRead: true,
  },
  {
    id: 9,
    type: "mention",
    users: [{ id: 1, name: "Jordan", avatar: "/diverse-group-avatars.png" }],
    action: "mentioned you in a comment",
    content: {
      type: "comment",
      text: "I think @you would have some great insights on this design approach!",
    },
    time: "5h ago",
    isRead: true,
  },
  {
    id: 10,
    type: "topic",
    action: "New trending topic in Design",
    content: {
      type: "topic",
      title: "UI Design Trends 2024",
    },
    time: "6h ago",
    isRead: true,
  },
]

export function NotificationsView() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS)
  const [filteredNotifications, setFilteredNotifications] = useState(ALL_NOTIFICATIONS)

  // Filter notifications based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredNotifications(notifications)
    } else {
      setFilteredNotifications(
        notifications.filter((notification) => {
          if (activeTab === "likes") return notification.type === "like"
          if (activeTab === "replies") return notification.type === "comment" || notification.type === "mention"
          if (activeTab === "follows") return notification.type === "follow"
          return true
        }),
      )
    }
  }, [activeTab, notifications])

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  // Get unread count
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/90">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={markAllAsRead}>
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="w-full bg-zinc-800/50 border border-zinc-700/50 p-1 rounded-full">
            <TabsTrigger
              value="all"
              className="flex-1 rounded-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
            >
              All
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex-1 rounded-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
            >
              Likes
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="flex-1 rounded-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
            >
              Replies
            </TabsTrigger>
            <TabsTrigger
              value="follows"
              className="flex-1 rounded-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
            >
              Follows
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="flex-1 overflow-y-auto mt-2">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-zinc-800/50">
              {filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <EmptyState type={activeTab} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationItem({ notification }: { notification: any }) {
  // Get notification icon based on type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return (
          <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
            <Heart className="h-3 w-3 text-white" />
          </div>
        )
      case "comment":
      case "mention":
        return (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
        )
      case "repost":
        return (
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
            <RefreshCw className="h-3 w-3 text-white" />
          </div>
        )
      case "follow":
        return (
          <div className="absolute -bottom-1 -right-1 bg-violet-500 rounded-full p-1">
            <UserPlus className="h-3 w-3 text-white" />
          </div>
        )
      default:
        return null
    }
  }

  // Format user names for display
  const formatUserNames = () => {
    if (!notification.users) return ""

    if (notification.users.length === 1) {
      return notification.users[0].name
    } else if (notification.users.length === 2) {
      return `${notification.users[0].name} and ${notification.users[1].name}`
    } else {
      const othersCount = notification.users.length - 2
      return `${notification.users[0].name}, ${notification.users[1].name}, and ${othersCount} ${
        othersCount === 1 ? "other" : "others"
      }`
    }
  }

  return (
    <div className={`p-4 hover:bg-zinc-800/30 transition-colors ${notification.isRead ? "" : "bg-zinc-800/20"}`}>
      <div className="flex">
        <div className="relative mr-3">
          {notification.users ? (
            notification.users.length === 1 ? (
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={notification.users[0].avatar || "/placeholder.svg"}
                    alt={notification.users[0].name}
                  />
                  <AvatarFallback>{notification.users[0].name[0]}</AvatarFallback>
                </Avatar>
                {getNotificationIcon()}
              </div>
            ) : (
              <div className="relative">
                <AvatarGroup>
                  {notification.users.slice(0, 3).map((user: any) => (
                    <Avatar key={user.id} className="border-2 border-zinc-900 h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                {getNotificationIcon()}
              </div>
            )
          ) : (
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-6phcc.png" alt="Turf" />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
              {getNotificationIcon()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm">
                <span className="font-medium">{formatUserNames()}</span>{" "}
                <span className="text-zinc-300">{notification.action}</span>
              </p>

              {notification.content && (
                <div className="mt-1">
                  {notification.content.type === "comment" || notification.content.type === "mention" ? (
                    <p className="text-sm text-zinc-400 bg-zinc-800/50 p-2 rounded-md border border-zinc-700/50 mt-1">
                      {notification.content.text}
                    </p>
                  ) : notification.content.type === "post" ? (
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-violet-400 transition-colors inline-block mt-1"
                    >
                      {notification.content.title} <span className="text-zinc-500">{notification.content.link}</span>
                    </Link>
                  ) : notification.content.type === "topic" ? (
                    <Link
                      href="#"
                      className="text-sm text-zinc-400 hover:text-violet-400 transition-colors inline-block mt-1"
                    >
                      {notification.content.title}
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
            <span className="text-xs text-zinc-500 ml-2 whitespace-nowrap">{notification.time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ type }: { type: string }) {
  let message = ""
  let icon = null

  switch (type) {
    case "likes":
      message = "No likes yet"
      icon = <Heart className="h-8 w-8 text-zinc-500 mb-2" />
      break
    case "replies":
      message = "No replies yet"
      icon = <MessageSquare className="h-8 w-8 text-zinc-500 mb-2" />
      break
    case "follows":
      message = "No followers yet"
      icon = <UserPlus className="h-8 w-8 text-zinc-500 mb-2" />
      break
    default:
      message = "No notifications yet"
      icon = <Bell className="h-8 w-8 text-zinc-500 mb-2" />
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
      {icon}
      <p className="text-lg font-medium text-zinc-300">{message}</p>
      <p className="text-sm text-zinc-500 mt-1">When you get notifications, they'll show up here.</p>
    </div>
  )
}
