'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/app/lib/utils'

interface ChatMediaProps {
  type: 'image' | 'youtube'
  url: string
  alt?: string
  className?: string
}

export default function ChatMedia({ type, url, alt = '', className }: ChatMediaProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // YouTube video ID extraction
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Get appropriate YouTube thumbnail
  const getYouTubeThumbnail = (videoId: string) => {
    // Try HQ first, then MQ, then default
    const qualities = ['hqdefault', 'mqdefault', 'default']
    return qualities.map(quality => `https://img.youtube.com/vi/${videoId}/${quality}.jpg`)
  }

  if (type === 'youtube') {
    const videoId = getYouTubeId(url)
    if (!videoId) {
      return <div className="text-red-500">Invalid YouTube URL</div>
    }

    const thumbnails = getYouTubeThumbnail(videoId)

    return (
      <div className={cn(
        "relative w-[320px] h-[180px] rounded-lg overflow-hidden",
        "sm:w-[240px] sm:h-[135px]", // Mobile
        "md:w-[320px] md:h-[180px]", // Tablet
        "lg:w-[320px] lg:h-[180px]", // Desktop
        className
      )}>
        <Image
          src={thumbnails[0]}
          alt={alt || 'YouTube video thumbnail'}
          fill
          sizes="(max-width: 768px) 240px, 320px"
          className="object-cover"
          loading="lazy"
          onError={() => {
            // Try next quality if current fails
            const currentIndex = thumbnails.indexOf(thumbnails[0])
            if (currentIndex < thumbnails.length - 1) {
              thumbnails.shift()
            }
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden",
      "w-[280px] max-h-[280px]", // Mobile
      "md:w-[320px] md:max-h-[320px]", // Tablet
      "lg:w-[400px] lg:max-h-[400px]", // Desktop
      className
    )}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 400px"
        className={cn(
          "object-contain",
          isLoading ? 'blur-sm' : 'blur-0'
        )}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError('Failed to load image')
          setIsLoading(false)
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
} 