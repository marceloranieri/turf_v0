import type React from "react"
import { LeftSidebar } from "@/components/left-sidebar"

interface CircleLayoutProps {
  children: React.ReactNode
}

export function CircleLayout({ children }: CircleLayoutProps) {
  return (
    <div className="flex h-screen bg-black text-white">
      <LeftSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  )
}
