"use client"

import { Share2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface TodaysTopicCardProps {
  title: string
  imageUrl?: string
  category?: string
  joinUrl: string
  shareUrl: string
}

export default function TodaysTopicCard({
  title,
  imageUrl,
  category,
  joinUrl,
  shareUrl
}: TodaysTopicCardProps) {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
      {/* Topic Image */}
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600" />
        )}
      </div>

      {/* Topic Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        
        {category && (
          <div className="text-sm text-zinc-400 mb-4">{category}</div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="default"
            className="bg-white text-black hover:bg-zinc-100"
            onClick={() => window.location.href = joinUrl}
          >
            <Users className="w-4 h-4 mr-2" />
            Join Circle
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
            onClick={() => {
              navigator.share({
                title,
                url: shareUrl
              }).catch(() => {
                // Fallback to copying to clipboard
                navigator.clipboard.writeText(shareUrl)
              })
            }}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
