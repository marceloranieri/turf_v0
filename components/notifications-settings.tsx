"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Bell, Mail, Heart, AtSign, MessageSquare } from "lucide-react"

interface NotificationsSettingsProps {
  onChangesMade: () => void
}

export function NotificationsSettings({ onChangesMade }: NotificationsSettingsProps) {
  const [settings, setSettings] = useState({
    all: true,
    directMessages: true,
    mentions: true,
    follows: true,
    likes: true,
    reposts: true,
    comments: true,
    newTopics: true,
    emailNotifications: false,
    pushNotifications: true,
  })

  const handleToggle = (setting: keyof typeof settings) => (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: checked }))
    onChangesMade()
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Accordion type="single" collapsible defaultValue="notifications" className="w-full">
        <AccordionItem value="notifications" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            NOTIFICATIONS
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              {/* All Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">All notifications</p>
                    <p className="text-sm text-zinc-400">Enable or disable all notifications</p>
                  </div>
                </div>
                <Switch
                  checked={settings.all}
                  onCheckedChange={handleToggle("all")}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              {/* Direct Messages */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Direct messages</p>
                    <p className="text-sm text-zinc-400">Get notified when you receive a direct message</p>
                  </div>
                </div>
                <Switch
                  checked={settings.directMessages}
                  onCheckedChange={handleToggle("directMessages")}
                  className="data-[state=checked]:bg-violet-600"
                  disabled={!settings.all}
                />
              </div>

              {/* Mentions */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <AtSign className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Mentions</p>
                    <p className="text-sm text-zinc-400">Get notified when you are mentioned in a post</p>
                  </div>
                </div>
                <Switch
                  checked={settings.mentions}
                  onCheckedChange={handleToggle("mentions")}
                  className="data-[state=checked]:bg-violet-600"
                  disabled={!settings.all}
                />
              </div>

              {/* Likes */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Heart className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Likes</p>
                    <p className="text-sm text-zinc-400">Get notified when someone likes your post</p>
                  </div>
                </div>
                <Switch
                  checked={settings.likes}
                  onCheckedChange={handleToggle("likes")}
                  className="data-[state=checked]:bg-violet-600"
                  disabled={!settings.all}
                />
              </div>

              {/* Comments */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <MessageSquare className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Comments</p>
                    <p className="text-sm text-zinc-400">Get notified when someone comments on your post</p>
                  </div>
                </div>
                <Switch
                  checked={settings.comments}
                  onCheckedChange={handleToggle("comments")}
                  className="data-[state=checked]:bg-violet-600"
                  disabled={!settings.all}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible defaultValue="delivery" className="w-full">
        <AccordionItem value="delivery" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            DELIVERY METHODS
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-zinc-400">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={handleToggle("emailNotifications")}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Push notifications</p>
                    <p className="text-sm text-zinc-400">Receive notifications on your device</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={handleToggle("pushNotifications")}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
