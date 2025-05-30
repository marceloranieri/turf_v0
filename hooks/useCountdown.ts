import { useEffect, useState } from "react"

export function useCountdown(targetTime: Date) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const diff = targetTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("00:00:00")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      )
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  return timeLeft
} 