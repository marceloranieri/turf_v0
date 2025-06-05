'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Globe } from 'lucide-react'

export default function SidebarNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/dashboard', label: 'Feed', icon: Home },
    { href: '/dashboard/my-circles', label: 'My Circles', icon: Users },
    { href: '/dashboard/all-circles', label: 'All Circles', icon: Globe },
  ]

  return (
    <nav className="w-64 bg-zinc-900 p-4 min-h-screen">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 