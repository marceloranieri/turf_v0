"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface GifData {
  id: string
  title: string
  images: {
    fixed_height: {
      url: string
      width: string
      height: string
    }
  }
}

interface GifPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelectGif: (gifUrl: string) => void
}

const GIPHY_API_KEY = "ec6xzmx5PYuY0BQOpjBoNQ1RsAGvgCO2"

export function GifPicker({ isOpen, onClose, onSelectGif }: GifPickerProps) {
  const [gifs, setGifs] = useState<GifData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState("trending")

  const categories = [
    { id: "reactions", label: "Reactions" },
    { id: "emotions", label: "Emotions" },
    { id: "animals", label: "Animals" },
    { id: "sports", label: "Sports" },
    { id: "food", label: "Food" },
  ]

  const fetchGifs = async (query?: string, category?: string) => {
    setLoading(true)
    try {
      let url = ""

      if (query) {
        url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      } else if (category && category !== "trending") {
        url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${category}&limit=20&rating=g`
      } else {
        url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`
      }

      const response = await fetch(url)
      const data = await response.json()
      setGifs(data.data || [])
    } catch (error) {
      console.error("Error fetching GIFs:", error)
      setGifs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchGifs()
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchGifs(searchQuery)
      setActiveCategory("")
    }
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    setSearchQuery("")
    fetchGifs("", category)
  }

  const handleGifSelect = (gifUrl: string) => {
    onSelectGif(gifUrl)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />

      {/* GIF Picker - Positioned above message composer */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4">
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-violet-400" />
              <span className="font-semibold text-white">Choose a GIF</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-zinc-700/50">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for GIFs..."
                className="pl-10 bg-zinc-800/50 border-zinc-600/50 text-white placeholder-zinc-400 focus:border-violet-500/50"
              />
            </form>
          </div>

          {/* Categories */}
          <div className="p-4 border-b border-zinc-700/50">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer text-xs transition-colors",
                    activeCategory === category.id
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border-zinc-600/50",
                  )}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* GIF Grid */}
          <div className="h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-zinc-400">Loading GIFs...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-4">
                {gifs.map((gif) => (
                  <div
                    key={gif.id}
                    className="aspect-square bg-zinc-800/50 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-violet-500/50 transition-all group"
                    onClick={() => handleGifSelect(gif.images.fixed_height.url)}
                  >
                    <img
                      src={gif.images.fixed_height.url || "/placeholder.svg"}
                      alt={gif.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
