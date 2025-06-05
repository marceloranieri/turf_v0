'use client'

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  content: string
  created_at: string
  media_url?: string
  user_id: string
  votes?: number
  reactions?: any[]
}

export function MessageCard({ message }: { message: Message }) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      {message.media_url && (
        <div className="mb-2">
          <Image
            src={message.media_url}
            alt="Message media"
            width={300}
            height={200}
            className="rounded-lg"
          />
        </div>
      )}
      <p className="text-sm text-gray-800">{message.content}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
        {message.votes !== undefined && (
          <span className="flex items-center gap-1">
            <span>↑</span>
            {message.votes}
          </span>
        )}
      </div>
    </div>
  )
} 