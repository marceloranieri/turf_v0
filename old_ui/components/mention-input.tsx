"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  username: string
  displayName: string
  avatar: string
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  onMentionsChange: (mentions: string[]) => void
  placeholder?: string
  className?: string
}

const mockUsers: User[] = [
  { id: "1", username: "john", displayName: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", username: "jane", displayName: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", username: "alex", displayName: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", username: "sarah", displayName: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
]

export function MentionInput({ value, onChange, onMentionsChange, placeholder, className }: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mentionStart, setMentionStart] = useState(-1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }

    // Check for @ mentions
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = newValue.slice(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf("@")

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)

      // Check if we're still in a mention (no spaces after @)
      if (!textAfterAt.includes(" ") && textAfterAt.length >= 0) {
        setMentionStart(lastAtIndex)

        // Filter users based on input
        const filtered = mockUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(textAfterAt.toLowerCase()) ||
            user.displayName.toLowerCase().includes(textAfterAt.toLowerCase()),
        )

        setSuggestions(filtered)
        setShowSuggestions(filtered.length > 0)
        setSelectedIndex(0)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }

    // Extract mentions for parent component
    const mentionRegex = /@(\w+)/g
    const mentions = Array.from(newValue.matchAll(mentionRegex), (m) => m[1])
    onMentionsChange(mentions)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % suggestions.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        break
      case "Enter":
      case "Tab":
        e.preventDefault()
        selectMention(suggestions[selectedIndex])
        break
      case "Escape":
        setShowSuggestions(false)
        break
    }
  }

  const selectMention = (user: User) => {
    if (mentionStart === -1) return

    const beforeMention = value.slice(0, mentionStart)
    const afterMention = value.slice(textareaRef.current?.selectionStart || 0)
    const newValue = `${beforeMention}@${user.username} ${afterMention}`

    onChange(newValue)
    setShowSuggestions(false)

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = mentionStart + user.username.length + 2
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
      }
    }, 0)
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        rows={1}
      />

      {/* Mention Suggestions */}
      {showSuggestions && (
        <div className="absolute bottom-full mb-2 left-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 min-w-[250px]">
          {suggestions.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                index === selectedIndex ? "bg-violet-600/20" : "hover:bg-zinc-700/50"
              }`}
              onClick={() => selectMention(user)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{user.displayName}</div>
                <div className="text-xs text-zinc-400">@{user.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
