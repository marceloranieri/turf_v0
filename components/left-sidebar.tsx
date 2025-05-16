"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Bell, MessageSquare, Bookmark, User, Compass, Settings, MoreHorizontal, Plus } from "lucide-react"

export function LeftSidebar() {
  const [activeItem, setActiveItem] = useState("home")

  return (
    <div className="w-64 border-r border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80 p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <Avatar className="h-10 w-10 bg-zinc-700">
          <AvatarImage src="/placeholder.svg?height=40&width=40" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="ml-2 font-medium">Username</span>
        <Button variant="ghost" size="icon" className="ml-auto text-zinc-400 hover:text-white">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <nav className="space-y-1 flex-1">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Home"
          isActive={activeItem === "home"}
          onClick={() => setActiveItem("home")}
        />
        <NavItem
          icon={<Bell className="h-5 w-5" />}
          label="Notifications"
          badge="12"
          isActive={activeItem === "notifications"}
          onClick={() => setActiveItem("notifications")}
        />
        <NavItem
          icon={<MessageSquare className="h-5 w-5" />}
          label="Messages"
          isActive={activeItem === "messages"}
          onClick={() => setActiveItem("messages")}
        />
        <NavItem
          icon={<Bookmark className="h-5 w-5" />}
          label="Bookmarks"
          isActive={activeItem === "bookmarks"}
          onClick={() => setActiveItem("bookmarks")}
        />
        <NavItem
          icon={<User className="h-5 w-5" />}
          label="Profile"
          isActive={activeItem === "profile"}
          onClick={() => setActiveItem("profile")}
        />
        <NavItem
          icon={<Compass className="h-5 w-5" />}
          label="Explore"
          isActive={activeItem === "explore"}
          onClick={() => setActiveItem("explore")}
        />
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={activeItem === "settings"}
          onClick={() => setActiveItem("settings")}
        />
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-800/50">
        <h3 className="text-xs font-semibold text-zinc-400 mb-2">MY COMMUNITIES</h3>
        <div className="space-y-2">
          <CommunityItem name="Technology" count={5} />
          <CommunityItem name="Design" count={3} />
          <CommunityItem name="Gaming" count={8} />
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-2 text-zinc-400 justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Join Community
        </Button>
      </div>
    </div>
  )
}

function NavItem({
  icon,
  label,
  badge,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  badge?: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`flex items-center w-full p-2 rounded-md hover:bg-zinc-800/70 transition-colors ${
        isActive ? "bg-zinc-800/70 text-white" : "text-zinc-400"
      }`}
      onClick={onClick}
    >
      <div className="w-6 h-6 mr-4 flex items-center justify-center">{icon}</div>
      <span>{label}</span>
      {badge && (
        <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center">
          {badge}
        </Badge>
      )}
    </button>
  )
}

function CommunityItem({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex items-center group">
      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
      <span className="text-zinc-300 text-sm">{name}</span>
      <Badge
        variant="outline"
        className="ml-auto text-xs bg-zinc-800/50 text-zinc-400 border-zinc-700 group-hover:bg-zinc-800"
      >
        {count}
      </Badge>
    </div>
  )
}
