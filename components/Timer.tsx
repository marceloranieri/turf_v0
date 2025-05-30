"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimerProps {
  nextRefreshAt: Date
  size?: 'sm' | 'md'
  variant?: 'default' | 'subtle' | 'glass'
  showLabels?: boolean
  pulseOnEnd?: boolean
  className?: string
}

function getTimeRemaining(targetDate: Date) {
  const total = targetDate.getTime() - new Date().getTime()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  return { total, hours, minutes, seconds }
}

const variants = {
  default: 'bg-zinc-800',
  subtle: 'bg-zinc-900/60',
  glass: 'backdrop-blur-sm bg-zinc-900/60'
}

const sizes = {
  sm: {
    container: 'px-2 py-0.5 gap-2',
    number: 'text-lg',
    label: 'text-[10px]'
  },
  md: {
    container: 'px-3 py-1 gap-4',
    number: 'text-xl',
    label: 'text-xs'
  }
}

export default function Timer({
  nextRefreshAt,
  size = 'md',
  variant = 'default',
  showLabels = true,
  pulseOnEnd = false,
  className
}: TimerProps) {
  const [remaining, setRemaining] = useState(getTimeRemaining(nextRefreshAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(nextRefreshAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [nextRefreshAt])

  const segments = [
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds },
  ]

  return (
    <div className={cn(
      'flex items-center rounded-md text-center text-white font-medium',
      variants[variant],
      sizes[size].container,
      className
    )}>
      {segments.map((segment) => (
        <div key={segment.label} className="flex flex-col items-center">
          <div className={cn(
            'font-bold leading-none tabular-nums font-mono tracking-tight',
            sizes[size].number
          )}>
            {String(segment.value).padStart(2, '0')}
          </div>
          {showLabels && (
            <div className={cn(
              'text-zinc-400 uppercase tracking-wider',
              sizes[size].label
            )}>
              {segment.label}
            </div>
          )}
        </div>
      ))}
      {pulseOnEnd && remaining.total <= 10000 && (
        <motion.div
          className="absolute inset-0 rounded-md"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </div>
  )
} 