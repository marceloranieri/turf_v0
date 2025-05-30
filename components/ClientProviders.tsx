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
  
  if (!supabase) {
    return (
      <div className="text-zinc-400 text-sm p-6">
        Connecting to Turf...
      </div>
    )
  }

  return <AuthProvider supabase={supabase}>{children}</AuthProvider>
} 