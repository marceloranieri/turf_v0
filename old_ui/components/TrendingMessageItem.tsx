"use client"

import { Flame } from "lucide-react"

  message,
  category,
  engagementScore,
}: {
  message: string
  category: string
  engagementScore: number
}) {
  return (
    <div className="bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700 transition-colors duration-150">
      <p className="text-white text-sm line-clamp-2">{message}</p>
      <div className="flex justify-between items-center mt-2 text-xs text-zinc-400">
        <span className="bg-zinc-700 px-2 py-0.5 rounded-full">{category}</span>
        <div className="flex items-center gap-1 text-orange-400">
          <Flame size={14} />
          {engagementScore}
        </div>
      </div>
    </div>
  )
} 