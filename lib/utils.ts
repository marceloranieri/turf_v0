import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 *
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param immediate Whether to invoke the function on the leading edge instead of the trailing edge
 * @returns A debounced version of the provided function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    

    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(this, args)
    }
  }
}

/**
 * Throttles a function to only execute once per specified time period
 *
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 * @returns A throttled version of the provided function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false
  let lastResult: ReturnType<T>

  return function (this: any, ...args: Parameters<T>): void {
    

    if (!inThrottle) {
      lastResult = func.apply(this, args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 *
 * @param date The date to format
 * @returns A string representing the relative time
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date()
  const dateObj = new Date(date)
  const diff = now.getTime() - dateObj.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return "just now"
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else {
    return dateObj.toLocaleDateString()
  }
}
