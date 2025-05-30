"use client"

import { Users, Flame } from "lucide-react"

export default function TopicCard({
  title,
  category,
  userCount,
  isTrending = false,
  onJoin,
  onCopyLink,
}: {
  title: string
  category: string
  userCount: number
  isTrending?: boolean
  onJoin: () => void
  onCopyLink: () => void
}) {
  return (
    <div className="bg-zinc-800 rounded-2xl p-4 hover:bg-zinc-700 transition-colors duration-150 shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-white text-lg font-semibold leading-snug">{title}</h3>
        {isTrending && (
          <div className="flex items-center gap-1 text-orange-400 text-sm">
            <Flame size={16} />
            Trending
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between text-sm text-zinc-400">
        <span className="bg-zinc-700 px-2 py-0.5 rounded-full text-xs">{category}</span>
        <div className="flex items-center gap-1">
          <Users size={14} />
          {userCount}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onJoin}
          className="text-indigo-400 text-sm hover:underline transition"
        >
          Join Circle
        </button>
        <button
          onClick={onCopyLink}
          className="text-zinc-500 text-sm hover:text-zinc-300 transition"
        >
          Copy Link
        </button>
      </div>
    </div>
  )
}
