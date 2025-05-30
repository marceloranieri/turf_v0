"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import SidebarTabs from "@/components/right-sidebar/Tabs"
import Timer from "@/components/Timer"

// Dynamically import components with SSR disabled
const Trending = dynamic(() => import("@/components/right-sidebar/Trending"), { ssr: false })
const SuggestedUsers = dynamic(() => import("@/components/right-sidebar/SuggestedUsers"), { ssr: false })

export default function RightSidebar({ nextRefreshAt }: { nextRefreshAt: Date }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <aside className="w-full md:w-[320px] p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-base font-semibold">Live Activity</h3>
          <Timer nextRefreshAt={nextRefreshAt} />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-zinc-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-full md:w-[320px] p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-base font-semibold">Live Activity</h3>
        <Timer nextRefreshAt={nextRefreshAt} />
      </div>
      <SidebarTabs />
      <Trending />
      <SuggestedUsers />
    </aside>
  )
}
