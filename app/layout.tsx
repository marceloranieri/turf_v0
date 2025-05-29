"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ProfileProvider } from "@/context/profile-context"
import { TopicsProvider } from "@/context/topics-context"
import { createBrowserClient } from "@supabase/ssr"

const inter = Inter({ subsets: ["latin"] })

// Debug environment variables
console.log("ENV DEBUG", {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 5) + "..." // Only log first 5 chars of key for security
})

// Create Supabase client for browser
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider supabase={supabase}>
            <ProfileProvider>
              <TopicsProvider>
                {children}
                <Toaster />
              </TopicsProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
