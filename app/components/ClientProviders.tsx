"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ProfileProvider } from "@/context/profile-context"
import { TopicsProvider } from "@/context/topics-context"
import { createBrowserClient } from "@supabase/ssr"

// Create Supabase client for browser
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
          </TopicsProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 