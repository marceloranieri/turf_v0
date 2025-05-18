import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ProfileProvider } from "@/components/profile-provider"
import { TopicsProvider } from "@/context/topics-context"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/lib/supabase-provider"
import { BookmarkProvider } from "@/components/bookmark-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Turf - Talk Like a Human. Not a Handle.",
  description: "Turf is a new kind of social space—one where chats are real, ideas matter, and nobody's chasing likes.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if Supabase environment variables are available
  const isMissingEnvVars = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {isMissingEnvVars ? (
          <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <h1 className="text-2xl font-bold mb-4">Environment Setup Required</h1>
            <p className="max-w-md text-zinc-400 mb-6">
              Missing Supabase environment variables. Please add the required environment variables to your project.
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 max-w-lg text-left">
              <p className="text-sm text-zinc-300 mb-2">Required environment variables:</p>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>SUPABASE_SERVICE_ROLE_KEY (for admin operations)</li>
              </ul>
            </div>
          </div>
        ) : (
          <SupabaseProvider>
            <AuthProvider>
              <ProfileProvider>
                <TopicsProvider>
                  <BookmarkProvider>
                    {children}
                    <Toaster />
                  </BookmarkProvider>
                </TopicsProvider>
              </ProfileProvider>
            </AuthProvider>
          </SupabaseProvider>
        )}
      </body>
    </html>
  )
}
