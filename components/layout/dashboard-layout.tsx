"use client"

import type React from "react"

// Inline LeftSidebar component
const LeftSidebar = () => {
  return (
    <div className="w-64 h-full border-r border-zinc-800/50 p-4 bg-zinc-900/80">
      <nav className="space-y-2">
        <div className="p-2 hover:bg-zinc-800/50 rounded cursor-pointer text-zinc-300">Dashboard</div>
        <div className="p-2 hover:bg-zinc-800/50 rounded cursor-pointer text-zinc-300">Search</div>
        <div className="p-2 hover:bg-zinc-800/50 rounded cursor-pointer text-zinc-300">Settings</div>
      </nav>
    </div>
  )
}

// Inline RightSidebar component
const RightSidebar = () => {
  return (
    <div className="w-64 h-full border-l border-zinc-800/50 p-4 bg-zinc-900/80">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-300">Notifications</h3>
        <p className="text-sm text-zinc-400">No new notifications</p>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
      <LeftSidebar />
      <main className="flex-1 overflow-auto border-x border-zinc-800/50 backdrop-blur-sm bg-zinc-900/80">
        {children}
      </main>
      <RightSidebar />
    </div>
  )
}
