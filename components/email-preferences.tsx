"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function EmailPreferences() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { toast: useToastToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState("")
  const [marketingEmails, setMarketingEmails] = useState(true)
  const [newsletterEmails, setNewsletterEmails] = useState(true)
  const [notificationEmails, setNotificationEmails] = useState(true)
  const [reminderEmails, setReminderEmails] = useState(true)

  const updatePreference = async (key: string, value: boolean) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("email_preferences")
        .upsert({
          user_id: user.id,
          [key]: value
        })

      if (error) throw error

      if (key === "marketing") {
        setMarketingEmails(value)
      } else if (key === "newsletter") {
        setNewsletterEmails(value)
      } else if (key === "notification") {
        setNotificationEmails(value)
      } else if (key === "reminder") {
        setReminderEmails(value)
      }
      toast.success("Preferences updated!")
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast.error("Failed to update preferences")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="animate-pulse bg-gray-800 h-6 w-48 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-gray-800 h-4 w-72 rounded"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="animate-pulse bg-gray-800 h-5 w-32 rounded"></div>
              <div className="animate-pulse bg-gray-800 h-5 w-10 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <CardTitle className="text-2xl font-bold text-gray-800">Email Preferences</CardTitle>
        <CardDescription className="text-gray-600">
          Choose which notifications you'd like to receive via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700"
            placeholder="Your email address"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
            <div>
              <h3 className="font-medium">Marketing Emails</h3>
              <p className="text-sm text-zinc-400">Receive emails about new features and promotions</p>
            </div>
            <Switch
              checked={marketingEmails}
              onCheckedChange={(checked) => updatePreference("marketing", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
            <div>
              <h3 className="font-medium">Newsletter</h3>
              <p className="text-sm text-zinc-400">Get our weekly newsletter with the latest updates</p>
            </div>
            <Switch
              checked={newsletterEmails}
              onCheckedChange={(checked) => updatePreference("newsletter", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
            <div>
              <h3 className="font-medium">Notification Emails</h3>
              <p className="text-sm text-zinc-400">Receive emails about your account activity</p>
            </div>
            <Switch
              checked={notificationEmails}
              onCheckedChange={(checked) => updatePreference("notification", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
            <div>
              <h3 className="font-medium">Reminder Emails</h3>
              <p className="text-sm text-zinc-400">Receive reminder emails about upcoming debates and events</p>
            </div>
            <Switch
              checked={reminderEmails}
              onCheckedChange={(checked) => updatePreference("reminder", checked)}
              disabled={saving}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
        </div>
        
        <Button 
          onClick={() => {}} 
          disabled={saving}
          className="mt-4 w-full bg-[#4CAF50] hover:bg-[#3d8b40]"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  )
} 