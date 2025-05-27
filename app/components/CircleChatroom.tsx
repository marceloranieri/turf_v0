'use client'

import { useState, useEffect } from 'react'
import { useGiphy } from '@/app/hooks/useGiphy'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  reactions: { emoji: string; count: number }[]
  replies: Message[]
  isBookmarked: boolean
}

interface Topic {
  id: string
  text: string
  endTime: Date
  participantCount: number
}

export default function CircleChatroom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGiphyPicker, setShowGiphyPicker] = useState(false)
  const { gifs, loading: gifsLoading, searchGifs } = useGiphy()

  // Timer countdown
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    if (!currentTopic) return

    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(currentTopic.endTime)
      const diff = end.getTime() - now.getTime()

      if (diff <= 0) {
        clearInterval(timer)
        setTimeLeft('00:00')
        // TODO: Handle topic expiration
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTopic])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar (from dashboard) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        {/* TODO: Import and use dashboard sidebar */}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentTopic?.text || 'Loading topic...'}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500">
                    {currentTopic?.participantCount || 0} participants
                  </span>
                  <span className="text-sm font-medium text-red-500">
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-[580px] mx-auto space-y-4">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onReact={(emoji) => {/* TODO: Handle reaction */}}
                onReply={() => {/* TODO: Handle reply */}}
                onBookmark={() => {/* TODO: Handle bookmark */}}
                onReport={() => {/* TODO: Handle report */}}
              />
            ))}
          </div>
        </div>

        {/* Message Composer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-[580px] mx-auto">
            <MessageComposer
              value={inputValue}
              onChange={setInputValue}
              onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)}
              onGiphyClick={() => setShowGiphyPicker(!showGiphyPicker)}
              onSend={() => {/* TODO: Handle send */}}
            />
          </div>
        </div>
      </main>

      {/* Radar Sidebar (Desktop Only) */}
      <aside className="w-80 bg-white border-l border-gray-200 hidden lg:block">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Activity Radar</h2>
          {/* TODO: Implement radar tiles */}
        </div>
      </aside>

      {/* Emoji/GIF Pickers */}
      {(showEmojiPicker || showGiphyPicker) && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50" onClick={() => {
          setShowEmojiPicker(false)
          setShowGiphyPicker(false)
        }}>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4">
            {showEmojiPicker && (
              <div className="w-64 h-64">
                {/* TODO: Implement emoji picker */}
              </div>
            )}
            {showGiphyPicker && (
              <div className="w-64 h-64">
                {/* TODO: Implement Giphy picker */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Message Card Component
function MessageCard({ message, onReact, onReply, onBookmark, onReport }: {
  message: Message
  onReact: (emoji: string) => void
  onReply: () => void
  onBookmark: () => void
  onReport: () => void
}) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        <img
          src={message.userAvatar}
          alt={message.userName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{message.userName}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-gray-800">{message.content}</p>
          
          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                  onClick={() => onReact(reaction.emoji)}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-600">{reaction.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Hover Actions */}
          {showActions && (
            <div className="absolute right-4 top-4 flex items-center space-x-2">
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={() => onReact('👍')}
              >
                😀
              </button>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={onReply}
              >
                ↩️
              </button>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={onBookmark}
              >
                {message.isBookmarked ? '🔖' : '📑'}
              </button>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={onReport}
              >
                ⚠️
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Threaded Replies */}
      {message.replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4">
          {message.replies.map((reply) => (
            <MessageCard
              key={reply.id}
              message={reply}
              onReact={onReact}
              onReply={onReply}
              onBookmark={onBookmark}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Message Composer Component
function MessageComposer({ value, onChange, onEmojiClick, onGiphyClick, onSend }: {
  value: string
  onChange: (value: string) => void
  onEmojiClick: () => void
  onGiphyClick: () => void
  onSend: () => void
}) {
  const charLimit = 300
  const remainingChars = charLimit - value.length

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        maxLength={charLimit}
      />
      <div className="absolute bottom-3 right-3 flex items-center space-x-2">
        <span className={`text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
          {remainingChars}
        </span>
        <button
          onClick={onEmojiClick}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          😀
        </button>
        <button
          onClick={onGiphyClick}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          🎬
        </button>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
} 