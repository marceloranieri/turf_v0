'use client'
import { useEffect, useState } from 'react'

export default function RefreshTimer() {
  const [timeLeft, setTimeLeft] = useState('')
  const [lastFetch, setLastFetch] = useState(0)
  const REFRESH_INTERVAL = 24 * 60 * 60 * 1000

  // Load last fetch time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('turf_last_fetch')
    if (stored) {
      setLastFetch(parseInt(stored))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const delta = REFRESH_INTERVAL - (now - lastFetch)
      const h = Math.floor(delta / 3600000)
      const m = Math.floor((delta % 3600000) / 60000)
      const s = Math.floor((delta % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [lastFetch])

  return (
    <p className="text-sm text-zinc-400 mt-1">
      Topics refresh in: <span className="text-white font-mono">{timeLeft}</span>
    </p>
  )
}
