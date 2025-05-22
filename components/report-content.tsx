"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

const REPORT_REASONS = [
  { id: "spam", label: "Spam" },
  { id: "harassment", label: "Harassment or bullying" },
  { id: "hate_speech", label: "Hate speech" },
  { id: "misinformation", label: "Misinformation" },
  { id: "violence", label: "Violence or threats" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "other", label: "Other" },
]

export function ReportContent({
  contentId,
  contentType,
  trigger,
}: {
  contentId: string
  contentType: "message" | "topic" | "user"
  trigger?: React.ReactNode
}) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report content",
        variant: "destructive",
      })
      return
    }

    if (!reason) {
      toast({
        title: "Reason required",
        description: "Please select a reason for your report",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create report
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        content_id: contentId,
        content_type: contentType,
        reason,
        details: details || null,
      })

      if (error) throw error

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
      })

      // Close dialog and reset form
      setOpen(false)
      setReason("")
      setDetails("")
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-300">
            <Flag className="h-4 w-4 mr-1" />
            <span className="text-xs">Report</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-800 border-zinc-700">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
            <DialogDescription>Help us understand what's wrong with this content</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for reporting</Label>
              <RadioGroup value={reason} onValueChange={setReason}>
                {REPORT_REASONS.map((reportReason) => (
                  <div key={reportReason.id} className="flex items-center space-x-2 py-2">
                    <RadioGroupItem
                      value={reportReason.id}
                      id={`reason-${reportReason.id}`}
                      className="border-zinc-600 text-violet-500"
                    />
                    <Label htmlFor={`reason-${reportReason.id}`} className="cursor-pointer">
                      {reportReason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional details (optional)</Label>
              <Textarea
                id="details"
                placeholder="Please provide any additional information that might help us understand the issue"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="bg-zinc-700 border-zinc-600 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-zinc-600">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !reason} className="bg-red-600 hover:bg-red-700">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
