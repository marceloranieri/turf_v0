"use client"

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Loader2 } from 'lucide-react'
import { AuthenticatedDashboard } from '@/components/dashboard/AuthenticatedDashboard'

export default function DashboardPage() {
  const supabase = useSupabase()
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const init = async () => {
      // 👇 Always wait for onAuthStateChange at least once before reading session
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.id) {
          setUserId(session.user.id)
        } else {
          setUserId(null)
        }
        setAuthChecked(true)
      })

      // 👇 Immediately get session (optional fallback in case already available)
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id)
        setAuthChecked(true)
      }

      return () => authListener?.subscription.unsubscribe()
    }

    init()
  }, [supabase])

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Checking login status...</span>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="text-center text-red-500 mt-12">
        <h2>User not authenticated</h2>
        <p>Please log in again to access your dashboard.</p>
      </div>
    )
  }

  return <AuthenticatedDashboard userId={userId} />
}
