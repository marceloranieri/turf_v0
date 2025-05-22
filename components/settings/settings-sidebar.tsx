"use client"

import { Button } from "@/components/ui/button"

export function SettingsSidebar() {
  return (
    <div className="space-y-2">
      <Button variant="ghost" className="w-full justify-start">Account</Button>
      <Button variant="ghost" className="w-full justify-start">Preferences</Button>
      <Button variant="ghost" className="w-full justify-start">Notifications</Button>
    </div>
  )
} 