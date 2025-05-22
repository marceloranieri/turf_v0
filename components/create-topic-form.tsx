"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

const CATEGORIES = [
  { id: "technology", name: "Technology" },
  { id: "gaming", name: "Gaming" },
  { id: "sports", name: "Sports" },
  { id: "music", name: "Music" },
  { id: "movies", name: "Movies" },
  { id: "books", name: "Books" },
  { id: "food", name: "Food" },
  { id: "travel", name: "Travel" },
  { id: "fashion", name: "Fashion" },
  { id: "art", name: "Art" },
  { id: "science", name: "Science" },
  { id: "health", name: "Health" },
]

export function CreateTopicForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [question, setQuestion] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("24")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        variant: "destructive",
      })
      return
    }

    if (!title.trim() || !question.trim() || !category || !duration) {
      toast({
        title: "Missing fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Calculate expiration time
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + Number.parseInt(duration))

      // Create topic
      const { data, error } = await supabase
        .from("topics")
        .insert({
          title,
          question,
          category,
          created_by: user.id,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Topic created",
      })

      // Close dialog and reset form
      setOpen(false)
      setTitle("")
      setQuestion("")
      setCategory("")
      setDuration("24")

      // Navigate to the new topic
      router.push(`/topics/${data.id}`)
    } catch (error) {
      console.error("Error creating topic:", error)
      toast({
        title: "Error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-violet-600 hover:bg-violet-700">Create Topic</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Topic</DialogTitle>
            <DialogDescription>Start a conversation about something you're interested in</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your topic a clear title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-700 border-zinc-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="What would you like to discuss?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-zinc-700 border-zinc-600 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category" className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration} required>
                  <SelectTrigger id="duration" className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="72">72 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-zinc-600">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Topic"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
