"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Youtube, Smile, Send, AtSign, Zap, X, Upload } from "lucide-react"
import { GifPicker } from "./gif-picker"
import { UrlPreview } from "./url-preview"
import { cn } from "@/lib/utils"

interface EnhancedMessageComposerProps {
  value: string
  onChange: (value: string, mentions: any[]) => void
  onSend: () => void
  users: any[]
  mentions: any[]
  maxLength?: number
  disabled?: boolean
}

export function EnhancedMessageComposer({
  value,
  onChange,
  onSend,
  users,
  mentions,
  maxLength = 300,
  disabled = false,
}: EnhancedMessageComposerProps) {
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<Array<{ type: string; url: string; name: string }>>([])
  const [detectedUrls, setDetectedUrls] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // URL detection
  const detectUrls = useCallback((text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urls = text.match(urlRegex) || []
    setDetectedUrls(urls)
  }, [])

  const handleInputChange = (newValue: string, newMentions: any[]) => {
    onChange(newValue, newMentions)
    detectUrls(newValue)
  }

  // Drag and Drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024, // 2MB limit
    )

    imageFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      setAttachedFiles((prev) => [
        ...prev,
        {
          type: file.type,
          url,
          name: file.name,
        },
      ])
    })
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024)

    validFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      setAttachedFiles((prev) => [...prev, { type: file.type, url, name: file.name }])
    })
  }

  const handleGifSelect = (gifUrl: string) => {
    setAttachedFiles((prev) => [...prev, { type: "gif", url: gifUrl, name: "GIF" }])
    setShowGifPicker(false)
  }

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeUrl = (urlToRemove: string) => {
    const newValue = value.replace(urlToRemove, "").trim()
    onChange(newValue, mentions)
    detectUrls(newValue)
  }

  const handleSend = () => {
    if (!value.trim() && attachedFiles.length === 0) return
    onSend()
    setAttachedFiles([])
    setDetectedUrls([])
  }

  const isOverLimit = value.length > maxLength
  const hasContent = value.trim() || attachedFiles.length > 0 || detectedUrls.length > 0

  return (
    <>
      <div className="border-t border-zinc-800/50 bg-zinc-900/95 backdrop-blur-xl">
        {/* Attachments and URL Previews */}
        {(attachedFiles.length > 0 || detectedUrls.length > 0) && (
          <div className="px-6 pt-4 border-b border-zinc-800/30">
            <div className="max-w-[580px] mx-auto space-y-3">
              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="h-24 w-24 object-cover rounded-xl border border-zinc-700/50 shadow-lg"
                        style={{ maxWidth: "400px" }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      >
                        <X className="h-3 w-3 text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* URL Previews */}
              {detectedUrls.length > 0 && (
                <div className="space-y-3">
                  {detectedUrls.map((url, index) => (
                    <UrlPreview key={index} url={url} onRemove={() => removeUrl(url)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Composer */}
        <div className="p-6">
          <div className="max-w-[580px] mx-auto">
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-violet-500/20 shadow-lg">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm">
                    Y
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-zinc-900 shadow-sm" />
              </div>

              {/* Input Container with Drag & Drop */}
              <div className="flex-1 min-w-0">
                <div
                  ref={dropZoneRef}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={cn(
                    "relative bg-zinc-800/40 backdrop-blur-sm rounded-2xl border transition-all duration-300",
                    hasContent
                      ? "border-violet-500/40 shadow-lg shadow-violet-500/10"
                      : "border-zinc-700/50 hover:border-zinc-600/50",
                    isOverLimit && "border-red-500/50 shadow-red-500/10",
                    isDragOver && "border-violet-400 bg-violet-500/5 shadow-lg shadow-violet-500/20",
                  )}
                >
                  {/* Drag Overlay */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-violet-500/5 backdrop-blur-sm rounded-2xl border-2 border-dashed border-violet-400 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-violet-400 mx-auto mb-2" />
                        <p className="text-violet-300 font-medium text-sm">Drop images here</p>
                        <p className="text-violet-400/70 text-xs">Max 2MB • JPG, PNG, WebP</p>
                      </div>
                    </div>
                  )}

                  {/* Mention Pills */}
                  {mentions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-4 pb-0">
                      {mentions.map((mention, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-violet-500/15 text-violet-300 border-violet-500/30 text-xs font-medium px-2 py-1"
                        >
                          @{mention.username}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Text Input - NO SCROLLBAR */}
                  <textarea
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value, mentions)}
                    placeholder="Share your thoughts..."
                    maxLength={maxLength}
                    className={cn(
                      "w-full bg-transparent border-none resize-none text-white placeholder:text-zinc-400",
                      "focus:outline-none focus:ring-0 p-4 text-[15px] leading-relaxed",
                      "min-h-[60px] max-h-[120px]",
                      "scrollbar-none overflow-hidden", // Remove scrollbar
                      isOverLimit && "text-red-400",
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    rows={1}
                    style={{
                      height: "auto",
                      minHeight: "60px",
                      maxHeight: "120px",
                      scrollbarWidth: "none", // Firefox
                      msOverflowStyle: "none", // IE/Edge
                    }}
                  />

                  {/* Bottom Bar */}
                  <div className="flex items-center justify-between px-4 pb-4">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200 rounded-lg"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 transition-all duration-200 rounded-lg",
                          showGifPicker
                            ? "text-violet-400 bg-violet-500/15"
                            : "text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10",
                        )}
                        onClick={() => setShowGifPicker(!showGifPicker)}
                        disabled={disabled}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 rounded-lg"
                        disabled={disabled}
                      >
                        <Youtube className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200 rounded-lg"
                        disabled={disabled}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>

                      <div className="w-px h-5 bg-zinc-600/30 mx-2" />

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 rounded-lg"
                        disabled={disabled}
                      >
                        <AtSign className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Character Count & Send */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        {attachedFiles.length > 0 && (
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs px-2 py-0.5">
                            {attachedFiles.length}
                          </Badge>
                        )}
                        <span
                          className={cn(
                            "font-medium transition-colors tabular-nums",
                            isOverLimit
                              ? "text-red-400"
                              : value.length > maxLength * 0.8
                                ? "text-yellow-400"
                                : "text-zinc-500",
                          )}
                        >
                          {value.length}/{maxLength}
                        </span>
                      </div>

                      <Button
                        onClick={handleSend}
                        disabled={!hasContent || isOverLimit || disabled}
                        className={cn(
                          "h-8 px-4 rounded-xl font-medium transition-all duration-300 text-sm",
                          hasContent && !isOverLimit
                            ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 scale-100 hover:scale-105"
                            : "bg-zinc-700/50 text-zinc-500 scale-95 cursor-not-allowed",
                        )}
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.gif"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* GIF Picker */}
      <GifPicker isOpen={showGifPicker} onClose={() => setShowGifPicker(false)} onSelectGif={handleGifSelect} />

      {/* Custom CSS to hide scrollbars */}
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
