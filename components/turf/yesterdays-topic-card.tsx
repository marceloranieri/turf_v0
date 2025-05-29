"use client"

import { Flame, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface YesterdaysTopicCardProps {
  topicTitle: string
  messageContent: string
  messageUser: string
  upvotes: number
  joinUrl: string
}

export default function YesterdaysTopicCard({
  topicTitle,
  messageContent,
  messageUser,
  upvotes,
  joinUrl
}: YesterdaysTopicCardProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{topicTitle}</h3>
          <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{messageContent}</p>
          
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>@{messageUser}</span>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{upvotes} upvotes</span>
            </div>
          </div>
        </div>

        <Button
          variant="default"
          className="bg-white text-black hover:bg-zinc-100"
          onClick={() => window.location.href = joinUrl}
        >
          <Users className="w-4 h-4 mr-2" />
          Join Circle
        </Button>
      </div>
    </div>
  )
}
