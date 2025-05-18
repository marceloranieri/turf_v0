import { EmailPreferences } from "@/components/email-preferences"

export default function EmailSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Email Settings</h1>
      <EmailPreferences />
    </div>
  )
}
