'use client'
import { useEffect, useState } from 'react'

export default function RefreshTimer() {
  const [timeLeft, setTimeLeft] = useState('')
  const REFRESH_INTERVAL = 24 * 60 * 60 * 1000

  useEffect(() => {
    const interval = setInterval(() => {
      const last = parseInt(localStorage.getItem('turf_last_fetch') || '0')
      const now = Date.now()
      const delta = REFRESH_INTERVAL - (now - last)
      const h = Math.floor(delta / 3600000)
      const m = Math.floor((delta % 3600000) / 60000)
      const s = Math.floor((delta % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className="text-sm text-zinc-400 mt-1">
      Topics refresh in: <span className="text-white font-mono">{timeLeft}</span>
    </p>
  )
} 