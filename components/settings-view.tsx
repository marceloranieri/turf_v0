"use client"

import { useState } from "react"
import { SettingsSidebar } from "./settings-sidebar"
import { AccountSettings } from "./account-settings"
import { NotificationsSettings } from "./notifications-settings"
import { PreferencesSettings } from "./preferences-settings"
import { BlockedAccounts } from "./blocked-accounts"
import { ContactSupport } from "./contact-support"
import { Button } from "./ui/button"
import { Save } from "lucide-react"
import { useToast } from "./ui/use-toast"

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
