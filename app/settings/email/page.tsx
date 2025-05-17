import { EmailPreferences } from "@/components/email-preferences"

export default function EmailSettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">Email Settings</h1>
      <p className="text-gray-400 mb-6">Control how much we flood your inbox. Don't worry, we're not offended if you unsubscribe... much. 😉</p>
      <EmailPreferences />
    </div>
  )
} 