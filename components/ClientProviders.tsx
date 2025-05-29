"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ProfileProvider } from "@/context/profile-context"
import { TopicsProvider } from "@/context/topics-context"
import { SupabaseProvider } from "@/components/providers/SupabaseProvider"
import { useSupabase } from "@/components/providers/SupabaseProvider"

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
      <SupabaseProvider>
        <AuthProviderWithSupabase>
          <ProfileProvider>
            <TopicsProvider>
              {children}
            </TopicsProvider>
          </ProfileProvider>
        </AuthProviderWithSupabase>
      </SupabaseProvider>
    </ThemeProvider>
  )
}

function AuthProviderWithSupabase({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase()
  return <AuthProvider supabase={supabase}>{children}</AuthProvider>
} 