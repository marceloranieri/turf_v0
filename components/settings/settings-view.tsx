"use client"

import { useState } from "react"
import { SettingsSidebar } from "./settings-sidebar"
import { NotificationsSettings } from "./notifications-settings"
import { PreferencesSettings } from "./preferences-settings"
import { BlockedAccounts } from "./blocked-accounts"
import { ContactSupport } from "./contact-support"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useToast } from "./ui/use-toast"

// Inline AccountSettings component
const AccountSettings = ({ onChangesMade }: { onChangesMade: () => void }) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-zinc-400">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
          <h3 className="font-medium mb-2">Profile Information</h3>
          <p className="text-sm text-zinc-400 mb-4">Update your profile information and how others see you on the platform</p>
          <Button onClick={onChangesMade} className="bg-violet-600 hover:bg-violet-700">
            Edit Profile
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
          <h3 className="font-medium mb-2">Security</h3>
          <p className="text-sm text-zinc-400 mb-4">Manage your password and security settings</p>
          <Button onClick={onChangesMade} className="bg-violet-600 hover:bg-violet-700">
            Change Password
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
          <h3 className="font-medium mb-2">Account Deletion</h3>
          <p className="text-sm text-zinc-400 mb-4">Permanently delete your account and all associated data</p>
          <Button onClick={onChangesMade} variant="destructive">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}

type SettingsSection = "account" | "notifications" | "preferences" | "blocked" | "support"

export function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account")
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    // In a real app, we would save the changes to a database
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    })
    setHasChanges(false)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings onChangesMade={() => setHasChanges(true)} />
      case "notifications":
        return <NotificationsSettings onChangesMade={() => setHasChanges(true)} />
      case "preferences":
        return <PreferencesSettings onChangesMade={() => setHasChanges(true)} />
      case "blocked":
        return <BlockedAccounts onChangesMade={() => setHasChanges(true)} />
      case "support":
        return <ContactSupport />
      default:
        return <AccountSettings onChangesMade={() => setHasChanges(true)} />
    }
  }

  return (
    <div className="flex flex-col min-h-full relative">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/90">
        <h1 className="text-xl font-semibold">Account settings</h1>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </div>

      {/* Settings Content */}
      <div className="flex flex-1 min-h-0">
        {/* Settings Sidebar */}
        <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Settings Content Area */}
        <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
      </div>
    </div>
  )
}
