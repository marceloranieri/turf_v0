"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ProfileProvider } from "@/context/profile-context"
import { TopicsProvider } from "@/context/topics-context"
import { SupabaseProvider } from "@/components/providers/SupabaseProvider"
import { useSupabase } from "@/components/providers/SupabaseProvider"
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          name: 'sb',
          lifetime: 60 * 60 * 24 * 7,
          domain: '.vercel.app',
          path: '/',
          sameSite: 'Lax',
          secure: true,
        },
      }
    )
  );

  return <SessionContextProvider supabaseClient={supabase}>{children}</SessionContextProvider>;
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