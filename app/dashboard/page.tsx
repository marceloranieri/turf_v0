"use client"

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Loader2 } from 'lucide-react'
import { TurfFinalDashboard } from '@/components/dashboard/TurfFinalDashboard'
import { AuthenticatedDashboard } from '@/components/dashboard/AuthenticatedDashboard'

export default function DashboardPage() {
  const supabase = useSupabase()
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id)
      }
      setAuthChecked(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        setUserId(session.user.id)
      }
      setAuthChecked(true)
    })

    return () => listener?.subscription.unsubscribe()
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
