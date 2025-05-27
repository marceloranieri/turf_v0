import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ProfileProvider } from "@/context/profile-context"
import { TopicsProvider } from "@/context/topics-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Turf - Talk Like a Human. Not a Handle.",
  description: "Turf is a new kind of social space—one where chats are real, ideas matter, and nobody's chasing likes.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMissingEnvVars = !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY

  if (isMissingEnvVars) {
    return (
      <html lang="en">
        <body>
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Missing Environment Variables</h1>
            <p className="mb-4">The following environment variables are required:</p>
            <ul className="list-disc pl-6">
              <li>SUPABASE_URL</li>
              <li>SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <AuthProvider>
          <ProfileProvider>
            <TopicsProvider>
              {children}
              <Toaster />
            </TopicsProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
