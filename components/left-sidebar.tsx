"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  Circle,
  ChevronDown,
  ChevronRight,
  Pin,
  Lightbulb,
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
import { supabase } from "@/lib/supabase"
import { SuggestTopicModal } from "@/components/suggest-topic-modal"

export function LeftSidebar() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState(pathname === "/dashboard" ? "home" : "")
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)

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
        <SidebarMyCircles userId={user?.id || ""} />
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
          href="/explore"
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-zinc-400 justify-start"
          onClick={() => setIsSuggestModalOpen(true)}
          data-testid="suggest-topic-button"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Suggest Topic
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

      <SuggestTopicModal 
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
      />
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

function SidebarMyCircles({ userId }: { userId: string }) {
  const [expanded, setExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("sidebarMyCirclesExpanded") ?? "true")
    }
    return true
  })
  const [circles, setCircles] = useState<any[]>([])
  const [pinned, setPinned] = useState<string[]>([])
  const [order, setOrder] = useState<string[]>([])
  const router = usePathname()

  // Persist expanded state
  useEffect(() => {
    localStorage.setItem("sidebarMyCirclesExpanded", JSON.stringify(expanded))
  }, [expanded])

  // Fetch user's joined circles
  useEffect(() => {
    if (!userId) return
    supabase
      .from("memberships")
      .select("circle:topics(id, title, slug)")
      .eq("user_id", userId)
      .then(({ data }) => {
        const joined = data?.map((m: any) => m.circle) ?? []
        setCircles(joined)
        // Set order if not set
        if (!order.length) setOrder(joined.map((c: any) => c.id))
      })
  }, [userId])

  // Load pin/order state
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPinned(JSON.parse(localStorage.getItem("sidebarMyCirclesPinned") ?? "[]"))
      setOrder(JSON.parse(localStorage.getItem("sidebarMyCirclesOrder") ?? "[]"))
    }
  }, [])

  // Save pin/order state
  useEffect(() => {
    localStorage.setItem("sidebarMyCirclesPinned", JSON.stringify(pinned))
    localStorage.setItem("sidebarMyCirclesOrder", JSON.stringify(order))
  }, [pinned, order])

  // Pin/unpin
  const togglePin = (id: string) => {
    setPinned((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  // Reorder (simple up/down for now)
  const move = (id: string, dir: -1 | 1) => {
    setOrder((prev) => {
      const idx = prev.indexOf(id)
      if (idx < 0) return prev
      const newOrder = [...prev]
      const swapIdx = idx + dir
      if (swapIdx < 0 || swapIdx >= prev.length) return prev
      ;[newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]]
      return newOrder
    })
  }

  // Compose display list: pinned first, then others, both in order
  const displayCircles = [
    ...pinned.map((id) => circles.find((c) => c.id === id)).filter(Boolean),
    ...order
      .map((id) => circles.find((c) => c.id === id))
      .filter((c) => c && !pinned.includes(c.id)),
  ]

  return (
    <div className="mb-4">
      <button
        className="flex items-center w-full px-2 py-2 rounded-md hover:bg-zinc-800/70 transition-colors text-zinc-400 font-semibold text-sm mb-1"
        data-testid="nav-my-circles"
        onClick={() => setExpanded((e: boolean) => !e)}
        aria-expanded="true"
      >
        <Circle className="h-5 w-5 mr-3" />
        My Circles
        <span className="ml-auto">
          {expanded ? (
            <ChevronDown className="h-4 w-4 transition-transform" />
          ) : (
            <ChevronRight className="h-4 w-4 transition-transform" />
          )}
        </span>
      </button>
      {expanded && (
        <ul className="ml-2 mt-1 space-y-1" data-testid="my-circles-list">
          {displayCircles.map((circle, idx) => (
            <li key={circle.id} className="flex items-center group">
              <Link
                href={`/circle-chatroom/${circle.slug}`}
                className="flex-1 px-2 py-1 rounded hover:bg-zinc-800/60 transition-colors cursor-pointer flex items-center"
                data-testid={`my-circle-${circle.slug}`}
              >
                <span>{circle.title}</span>
              </Link>
              <button
                className="ml-1 p-1 text-zinc-400 hover:text-violet-500"
                title={pinned.includes(circle.id) ? "Unpin" : "Pin"}
                onClick={(e) => {
                  e.stopPropagation()
                  togglePin(circle.id)
                }}
                data-testid={`pin-circle-${circle.slug}`}
              >
                <Pin className={`h-4 w-4 ${pinned.includes(circle.id) ? "fill-violet-500" : ""}`} />
              </button>
              <button
                className="ml-1 p-1 text-zinc-400 hover:text-violet-500"
                title="Move up"
                onClick={(e) => {
                  e.stopPropagation()
                  move(circle.id, -1)
                }}
                disabled={idx === 0}
                data-testid={`moveup-circle-${circle.slug}`}
              >↑</button>
              <button
                className="ml-1 p-1 text-zinc-400 hover:text-violet-500"
                title="Move down"
                onClick={(e) => {
                  e.stopPropagation()
                  move(circle.id, 1)
                }}
                disabled={idx === displayCircles.length - 1}
                data-testid={`movedown-circle-${circle.slug}`}
              >↓</button>
            </li>
          ))}
          {displayCircles.length === 0 && (
            <li className="text-xs text-zinc-500 px-2 py-1">No joined circles yet.</li>
          )}
        </ul>
      )}
    </div>
  )
}
