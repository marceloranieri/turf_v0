"use client"

import type React from "react"

import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"

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
