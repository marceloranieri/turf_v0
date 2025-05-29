"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { useProfile } from "@/context/profile-context"

interface SuggestTopicModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuggestTopicModal({ isOpen, onClose }: SuggestTopicModalProps) {
  const [suggestion, setSuggestion] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { profile } = useProfile()

  const handleSubmit = async () => {
    if (!suggestion.trim()) return

    setIsSubmitting(true)
    try {
      const message = {
        text: `🧠 New Topic Suggestion\nFrom: ${profile?.email || user?.id}\nTopic: ${suggestion}\nCategory: ${category || 'Uncategorized'}\nTimestamp: ${new Date().toISOString()}`
      }

      // Send to Slack
      await fetch('/api/slack/suggest-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      })

      // Optional: Store in Supabase
      const { error } = await supabase
        .from('topic_suggestions')
        .insert({
          user_id: user?.id,
          suggestion,
          category,
          status: 'pending'
        })

      if (error) throw error

      setSuggestion("")
      setCategory("")
      onClose()
    } catch (error) {
      console.error('Error submitting suggestion:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" data-testid="suggest-topic-modal">
        <DialogHeader>
          <DialogTitle>Suggest a New Topic</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              placeholder="What topic would you like to suggest?"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="philosophy">Philosophy</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!suggestion.trim() || isSubmitting}
            data-testid="submit-topic-suggestion"
          >
            {isSubmitting ? "Sending..." : "Send Suggestion"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
