"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Music, Instagram, Facebook, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface UrlPreviewProps {
  url: string
  onRemove?: () => void
  className?: string
}

interface PreviewData {
  type: "youtube" | "spotify" | "instagram" | "tiktok" | "facebook" | "twitter" | "generic"
  title: string
  description?: string
  thumbnail?: string
  author?: string
  duration?: string
  platform: string
  favicon?: string
}

export function UrlPreview({ url, onRemove, className }: UrlPreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generatePreview(url)
  }, [url])

  const generatePreview = async (inputUrl: string) => {
    setLoading(true)
    try {
      // Detect platform and generate preview
      const preview = detectPlatformAndGeneratePreview(inputUrl)
      setPreviewData(preview)
    } catch (error) {
      console.error("Failed to generate preview:", error)
      setPreviewData(null)
    } finally {
      setLoading(false)
    }
  }

  const detectPlatformAndGeneratePreview = (inputUrl: string): PreviewData => {
    const url = inputUrl.toLowerCase()

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = extractYouTubeId(inputUrl)
      return {
        type: "youtube",
        title: "Advanced React Animations Tutorial",
        description:
          "Learn how to create smooth, professional animations in React using Framer Motion and CSS transitions.",
        thumbnail: `/placeholder.svg?height=180&width=320&text=YouTube+Video`,
        author: "React Tutorials Pro",
        duration: "12:34",
        platform: "YouTube",
        favicon: "🎥",
      }
    }

    // Spotify
    if (url.includes("spotify.com")) {
      return {
        type: "spotify",
        title: "Lofi Hip Hop Radio - Beats to Relax/Study To",
        description: "ChilledCow • 24/7 livestream",
        thumbnail: `/placeholder.svg?height=160&width=160&text=Spotify+Track`,
        author: "ChilledCow",
        platform: "Spotify",
        favicon: "🎵",
      }
    }

    // Instagram
    if (url.includes("instagram.com")) {
      return {
        type: "instagram",
        title: "Check out this post on Instagram",
        description: "Amazing sunset view from the mountains! 🌅 #nature #photography",
        thumbnail: `/placeholder.svg?height=200&width=200&text=Instagram+Post`,
        author: "@photographer_pro",
        platform: "Instagram",
        favicon: "📷",
      }
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      return {
        type: "tiktok",
        title: "Viral Dance Challenge",
        description: "This dance is taking over TikTok! 💃 #viral #dance #trending",
        thumbnail: `/placeholder.svg?height=240&width=135&text=TikTok+Video`,
        author: "@dancer_queen",
        platform: "TikTok",
        favicon: "🎵",
      }
    }

    // Facebook
    if (url.includes("facebook.com")) {
      return {
        type: "facebook",
        title: "Community Event: Tech Meetup 2024",
        description: "Join us for an amazing tech meetup with industry leaders and networking opportunities.",
        thumbnail: `/placeholder.svg?height=180&width=320&text=Facebook+Post`,
        author: "Tech Community Group",
        platform: "Facebook",
        favicon: "👥",
      }
    }

    // Twitter/X
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return {
        type: "twitter",
        title: "Breaking: New AI breakthrough announced",
        description:
          "Scientists have developed a new AI model that can understand context better than ever before. This could revolutionize how we interact with technology.",
        author: "@tech_news",
        platform: "X (Twitter)",
        favicon: "🐦",
      }
    }

    // Generic fallback
    return {
      type: "generic",
      title: "Link Preview",
      description: inputUrl,
      platform: "Website",
      favicon: "🔗",
    }
  }

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : ""
  }

  const getPlatformIcon = () => {
    switch (previewData?.type) {
      case "youtube":
        return <Play className="h-4 w-4 text-red-500" />
      case "spotify":
        return <Music className="h-4 w-4 text-green-500" />
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-500" />
      default:
        return <ExternalLink className="h-4 w-4 text-zinc-400" />
    }
  }

  const getPlatformColor = () => {
    switch (previewData?.type) {
      case "youtube":
        return "border-red-500/30 bg-red-500/5"
      case "spotify":
        return "border-green-500/30 bg-green-500/5"
      case "instagram":
        return "border-pink-500/30 bg-pink-500/5"
      case "tiktok":
        return "border-purple-500/30 bg-purple-500/5"
      case "facebook":
        return "border-blue-500/30 bg-blue-500/5"
      case "twitter":
        return "border-sky-500/30 bg-sky-500/5"
      default:
        return "border-zinc-700/50 bg-zinc-800/30"
    }
  }

  if (loading) {
    return (
      <div className={cn("rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-3 animate-pulse", className)}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-zinc-700 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-700 rounded w-3/4" />
            <div className="h-3 bg-zinc-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (!previewData) return null

  return (
    <div className={cn("rounded-lg border overflow-hidden max-w-md", getPlatformColor(), className)}>
      <div className="flex">
        {/* Thumbnail */}
        {previewData.thumbnail && (
          <div className="relative flex-shrink-0">
            <img
              src={previewData.thumbnail || "/placeholder.svg"}
              alt={previewData.title}
              className={cn(
                "object-cover",
                previewData.type === "youtube"
                  ? "w-32 h-20"
                  : previewData.type === "spotify"
                    ? "w-16 h-16"
                    : previewData.type === "tiktok"
                      ? "w-20 h-28"
                      : "w-20 h-20",
              )}
            />
            {previewData.type === "youtube" && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-red-600 rounded-full p-1.5">
                  <Play className="h-3 w-3 text-white fill-white ml-0.5" />
                </div>
              </div>
            )}
            {previewData.duration && (
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                {previewData.duration}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getPlatformIcon()}
                <span className="text-xs text-zinc-400 font-medium">{previewData.platform}</span>
              </div>
              <h4 className="font-medium text-white text-sm line-clamp-2 mb-1">{previewData.title}</h4>
              {previewData.description && (
                <p className="text-zinc-400 text-xs line-clamp-2 mb-1">{previewData.description}</p>
              )}
              {previewData.author && <p className="text-zinc-500 text-xs">{previewData.author}</p>}
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 text-zinc-400 hover:text-white ml-2 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
