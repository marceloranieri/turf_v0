"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Bell,
  MessageSquare,
  Bookmark,
  User,
  Compass,
  Settings,
  MoreHorizontal,
  Plus,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { useProfile } from "@/context/profile-context"

export function LeftSidebar() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState(pathname === "/dashboard" ? "home" : "")
  const { user, signOut } = useAuth()
  const { profile } = useProfile()

  return (
    <div className="w-64 border-r border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80 p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mr-2">
          <span className="text-sm font-bold text-white">T</span>
        </div>
        <span className="text-lg font-bold">Turf</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto text-zinc-400 hover:text-white">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-zinc-200">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem
              className="hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer text-red-400"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="space-y-1 flex-1">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Home"
          isActive={activeItem === "home"}
          onClick={() => setActiveItem("home")}
          href="/dashboard"
        />
        <NavItem
          icon={<Bell className="h-5 w-5" />}
          label="Notifications"
          badge="12"
          isActive={activeItem === "notifications"}
          onClick={() => setActiveItem("notifications")}
          href="/notifications"
        />
        <NavItem
          icon={<MessageSquare className="h-5 w-5" />}
          label="Messages"
          isActive={activeItem === "messages"}
          onClick={() => setActiveItem("messages")}
          href="#"
        />
        <NavItem
          icon={<Bookmark className="h-5 w-5" />}
          label="Bookmarks"
          isActive={activeItem === "bookmarks"}
          onClick={() => setActiveItem("bookmarks")}
          href="#"
        />
        <NavItem
          icon={<User className="h-5 w-5" />}
          label="Profile"
          isActive={activeItem === "profile"}
          onClick={() => setActiveItem("profile")}
          href={profile ? `/profile/${profile.username}` : "#"}
        />
        <NavItem
          icon={<Compass className="h-5 w-5" />}
          label="Explore"
          isActive={activeItem === "explore"}
          onClick={() => setActiveItem("explore")}
          href="#"
        />
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={activeItem === "settings"}
          onClick={() => setActiveItem("settings")}
          href="/settings"
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

      <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=40&width=40"} />
            <AvatarFallback>{profile?.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{profile?.full_name || "User"}</p>
            <p className="text-xs text-zinc-500">@{profile?.username || "username"}</p>
          </div>
        </div>
        <Button className="w-full mt-3 bg-violet-600 hover:bg-violet-700">Post</Button>
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
  href,
}: {
  icon: React.ReactNode
  label: string
  badge?: string
  isActive: boolean
  onClick: () => void
  href: string
}) {
  return (
    <Link
      href={href}
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
    </Link>
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
