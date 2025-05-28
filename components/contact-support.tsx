"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Send, FileText, MessageSquare, HelpCircle } from "lucide-react"

export function ContactSupport() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [supportCategory, setSupportCategory] = useState("")
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
    }, 1500)
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Accordion type="single" collapsible defaultValue="support" className="w-full">
        <AccordionItem value="support" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            CONTACT SUPPORT
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="bg-zinc-800/10 rounded-lg p-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Issue Category</label>
                    <Select value={supportCategory} onValueChange={setSupportCategory} required>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="technical">Technical Problems</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="report">Report Abuse</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      className="bg-zinc-800 border-zinc-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Message</label>
                    <Textarea
                      placeholder="Describe your issue in detail"
                      className="h-40 bg-zinc-800 border-zinc-700 text-white resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                    <p className="text-xs text-zinc-500 mt-1">{message.length}/1000 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Attachments (optional)</label>
                    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
                      <FileText className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                      <p className="text-sm text-zinc-400">Drag and drop files here, or click to select files</p>
                      <p className="text-xs text-zinc-500 mt-1">Maximum file size: 10MB</p>
                      <Input type="file" className="hidden" ref={fileInputRef} multiple />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4 bg-zinc-800 border-zinc-700 text-white"
                        onClick={handleFileClick}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent</h3>
                  <p className="text-zinc-400 mb-6 max-w-md">
                    Thank you for contacting support. We've received your message and will respond within 24-48 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onClick={() => {
                      setSubmitted(false)
                      setMessage("")
                      setSupportCategory("")
                    }}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Submit Another Request
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 bg-zinc-800/10 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-violet-400" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                <div className="border-b border-zinc-800/50 pb-4">
                  <h4 className="font-medium mb-2">How do I reset my password?</h4>
                  <p className="text-sm text-zinc-400">
                    You can reset your password by going to the login page and clicking on "Forgot password?". Follow
                    the instructions sent to your email to create a new password.
                  </p>
                </div>

                <div className="border-b border-zinc-800/50 pb-4">
                  <h4 className="font-medium mb-2">How do I change my username?</h4>
                  <p className="text-sm text-zinc-400">
                    Go to Account Settings, click on your profile information, and select "Edit" next to your username.
                    Note that you can only change your username once every 30 days.
                  </p>
                </div>

                <div className="pb-2">
                  <h4 className="font-medium mb-2">How can I delete my account?</h4>
                  <p className="text-sm text-zinc-400">
                    Account deletion can be found in Account Settings. This action is permanent and will delete all your
                    content and data from our platform.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
