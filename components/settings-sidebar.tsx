"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Settings, ShieldAlert, Headphones, ChevronRight } from "lucide-react"

type SettingsSection = "account" | "notifications" | "preferences" | "blocked" | "support"

interface SettingsSidebarProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="w-72 border-r border-zinc-800/50 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {/* User Profile */}
        <button
          className={`flex items-center w-full p-3 rounded-lg hover:bg-zinc-800/70 transition-colors text-left ${
            activeSection === "account" ? "bg-zinc-800/70" : ""
          }`}
          onClick={() => onSectionChange("account")}
        >
          <div className="flex items-center flex-1">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="/diverse-faces.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Moyo Shiro</div>
              <div className="text-sm text-zinc-400">@moyoshiro</div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-zinc-500" />
        </button>

        {/* Notifications */}
        <button
          className={`flex items-center w-full p-3 rounded-lg hover:bg-zinc-800/70 transition-colors ${
            activeSection === "notifications" ? "bg-zinc-800/70" : ""
          }`}
          onClick={() => onSectionChange("notifications")}
        >
          <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
            <Bell className="h-5 w-5 text-zinc-400" />
          </div>
          <span className="flex-1 text-left">Notifications</span>
          <ChevronRight className="h-5 w-5 text-zinc-500" />
        </button>

        {/* Preferences */}
        <button
          className={`flex items-center w-full p-3 rounded-lg hover:bg-zinc-800/70 transition-colors ${
            activeSection === "preferences" ? "bg-zinc-800/70" : ""
          }`}
          onClick={() => onSectionChange("preferences")}
        >
          <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
            <Settings className="h-5 w-5 text-zinc-400" />
          </div>
          <span className="flex-1 text-left">Preferences</span>
          <ChevronRight className="h-5 w-5 text-zinc-500" />
        </button>

        {/* Blocked Accounts */}
        <button
          className={`flex items-center w-full p-3 rounded-lg hover:bg-zinc-800/70 transition-colors ${
            activeSection === "blocked" ? "bg-zinc-800/70" : ""
          }`}
          onClick={() => onSectionChange("blocked")}
        >
          <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
            <ShieldAlert className="h-5 w-5 text-zinc-400" />
          </div>
          <span className="flex-1 text-left">Blocked accounts</span>
          <ChevronRight className="h-5 w-5 text-zinc-500" />
        </button>

        {/* Contact Support */}
        <button
          className={`flex items-center w-full p-3 rounded-lg hover:bg-zinc-800/70 transition-colors ${
            activeSection === "support" ? "bg-zinc-800/70" : ""
          }`}
          onClick={() => onSectionChange("support")}
        >
          <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
            <Headphones className="h-5 w-5 text-zinc-400" />
          </div>
          <span className="flex-1 text-left">Contact support</span>
          <ChevronRight className="h-5 w-5 text-zinc-500" />
        </button>
      </nav>
    </div>
  )
}
