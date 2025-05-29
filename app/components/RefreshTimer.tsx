import { useEffect, useState } from 'react'

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export default function RefreshTimer() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const last = parseInt(localStorage.getItem('turf_last_fetch') || '0')
      const now = Date.now()
      const delta = REFRESH_INTERVAL - (now - last)
      
      if (delta <= 0) {
        setTimeLeft('Refreshing...')
        return
      }

      const h = Math.floor(delta / 3600000)
      const m = Math.floor((delta % 3600000) / 60000)
      const s = Math.floor((delta % 60000) / 1000)
      
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      )
    }

    // Update immediately
    updateTimer()

    // Then update every second
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <span className="animate-pulse">⏳</span>
      <span>Topics refresh in: {timeLeft}</span>
    </div>
  )
} 