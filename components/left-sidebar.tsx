"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Settings, Users } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Debates", href: "/debates", icon: MessageSquare },
  { name: "Community", href: "/community", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function LeftSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-screen fixed left-0 top-0">
      <div className="p-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-8">
          <span className="text-xl font-bold text-white">T</span>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
