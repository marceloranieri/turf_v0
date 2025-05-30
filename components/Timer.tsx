"use client"

import { useEffect, useState } from 'react'

function getTimeRemaining(targetDate: Date) {
  const total = targetDate.getTime() - new Date().getTime()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  return { total, hours, minutes, seconds }
}

export default function Timer({ nextRefreshAt }: { nextRefreshAt: Date }) {
  const [remaining, setRemaining] = useState(getTimeRemaining(nextRefreshAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(nextRefreshAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [nextRefreshAt])

  return (
    <div className="flex items-center bg-zinc-800 rounded-xl px-3 py-1 gap-4 text-center text-white text-xs font-medium">
      {[
        { label: 'Hours', value: remaining.hours },
        { label: 'Minutes', value: remaining.minutes },
        { label: 'Seconds', value: remaining.seconds },
      ].map((segment) => (
        <div key={segment.label} className="flex flex-col items-center">
          <div className="text-2xl font-bold leading-none tabular-nums">
            {String(segment.value).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
            {segment.label}
          </div>
        </div>
      ))}
    </div>
  )
} 