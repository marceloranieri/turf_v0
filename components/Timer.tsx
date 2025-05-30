"use client"

import { Clock } from "lucide-react"
import { useCountdown } from "@/hooks/useCountdown"

export default function Timer({
  nextRefreshAt,
}: {
  nextRefreshAt: Date
}) {
  const timeLeft = useCountdown(nextRefreshAt)

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400 italic">
      <Clock size={16} className="text-zinc-500" />
      Refresh in: {timeLeft}
    </div>
  )
} 