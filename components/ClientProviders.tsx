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
          get(name) {
            if (typeof document === 'undefined') return null;
            const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
            return match ? match[2] : null;
          },
          set(name, value, options) {
            if (typeof document === 'undefined') return;
            const cookie = `${name}=${value}; path=${options?.path ?? '/'}${
              options?.maxAge ? `; max-age=${options.maxAge}` : ''
            }${options?.domain ? `; domain=${options.domain}` : ''}${
              options?.sameSite ? `; samesite=${options.sameSite}` : ''
            }${options?.secure ? '; secure' : ''}`;
            document.cookie = cookie;
          },
          remove(name, options) {
            if (typeof document === 'undefined') return;
            document.cookie = `${name}=; Max-Age=0; path=${options?.path ?? '/'}`;
          },
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