"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Flag } from "lucide-react"

interface Message {
  id: string
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  timestamp: string
}

interface ReportMessageModalProps {
  message: Message
  onClose: () => void
}

const reportReasons = [
  { id: "spam", label: "Spam or unwanted content" },
  { id: "harassment", label: "Harassment or bullying" },
  { id: "hate", label: "Hate speech or discrimination" },
  { id: "misinformation", label: "Misinformation or false claims" },
  { id: "violence", label: "Violence or threats" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "other", label: "Other" },
]

export function ReportMessageModal({ message, onClose }: ReportMessageModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [additionalComments, setAdditionalComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return

    setIsSubmitting(true)

    try {
      const reportData = {
        messageId: message.id,
        reportedUser: message.user.username,
        reason: selectedReason,
        comments: additionalComments,
        messageContent: message.content,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      })

      if (response.ok) {
        onClose()
      } else {
        console.error("Failed to submit report")
      }
    } catch (error) {
      console.error("Error submitting report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-400" />
            <h2 className="font-semibold">Report Message</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Message Preview */}
        <div className="p-4 border-b border-zinc-700">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{message.user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{message.user.name}</span>
              <span className="text-xs text-zinc-500">{message.timestamp}</span>
            </div>
            <p className="text-sm text-zinc-300">{message.content}</p>
          </div>
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Why are you reporting this message?</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reportReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="text-sm cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="comments" className="text-sm font-medium mb-2 block">
              Additional comments {selectedReason === "other" && "(required)"}
            </Label>
            <Textarea
              id="comments"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Please provide more details about why you're reporting this message..."
              className="bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedReason || (selectedReason === "other" && !additionalComments.trim()) || isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
