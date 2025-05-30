"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock3 } from 'lucide-react'
import { cn } from '@/lib/utils'

type TimerVariant = 'default' | 'compact' | 'minimal'
type TimerScope = 'global' | 'circle' | 'explore'

interface TimerProps {
  nextRefreshAt: Date
  variant?: TimerVariant
  scope?: TimerScope
  showPulseOnFinal10?: boolean
  darkBlurBackground?: boolean
  className?: string
  onRefresh?: () => void
}

function getTimeRemaining(targetDate: Date) {
  const total = targetDate.getTime() - new Date().getTime()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  return { total, hours, minutes, seconds }
}

const variants = {
  default: {
    container: 'px-3 py-1 gap-4',
    number: 'text-xl',
    label: 'text-xs'
  },
  compact: {
    container: 'px-2 py-0.5 gap-2',
    number: 'text-lg',
    label: 'text-[10px]'
  },
  minimal: {
    container: 'px-1.5 py-0.5 gap-1.5',
    number: 'text-sm',
    label: 'text-[8px]'
  }
}

const scopeLabels = {
  global: 'Topics reset in',
  circle: 'Circle resets in',
  explore: 'Explore refreshes in'
}

export default function Timer({
  nextRefreshAt,
  variant = 'default',
  scope = 'global',
  showPulseOnFinal10 = false,
  darkBlurBackground = false,
  className,
  onRefresh
}: TimerProps) {
  const [remaining, setRemaining] = useState(getTimeRemaining(nextRefreshAt))
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemaining = getTimeRemaining(nextRefreshAt)
      setRemaining(newRemaining)

      // Trigger refresh when timer hits zero
      if (newRemaining.total <= 0 && !isRefreshing) {
        setIsRefreshing(true)
        onRefresh?.()
        // Reset after 1 second to allow for the refresh animation
        setTimeout(() => setIsRefreshing(false), 1000)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [nextRefreshAt, onRefresh, isRefreshing])

  const segments = [
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds },
  ]

  return (
    <div className={cn(
      'flex items-center rounded-md text-center text-white font-medium relative',
      darkBlurBackground ? 'backdrop-blur-sm bg-zinc-900/70' : 'bg-zinc-800',
      variants[variant].container,
      isRefreshing && 'animate-pulse',
      className
    )}>
      {variant !== 'minimal' && (
        <div className="flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400">
            {scopeLabels[scope]}
          </span>
        </div>
      )}
      {segments.map((segment) => (
        <div key={segment.label} className="flex flex-col items-center">
          <motion.div 
            className={cn(
              'font-bold leading-none tabular-nums font-mono tracking-tight',
              variants[variant].number
            )}
            key={segment.value}
            initial={false}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {String(segment.value).padStart(2, '0')}
          </motion.div>
          {variant !== 'minimal' && (
            <div className={cn(
              'text-zinc-400 uppercase tracking-wider',
              variants[variant].label
            )}>
              {segment.label}
            </div>
          )}
        </div>
      ))}
      {showPulseOnFinal10 && remaining.total <= 10000 && (
        <motion.div
          className="absolute inset-0 rounded-md bg-zinc-400/20"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </div>
  )
} 