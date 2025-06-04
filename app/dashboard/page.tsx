"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { AuthenticatedDashboard } from '@/components/dashboard/AuthenticatedDashboard'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
          router.push('/login')
        } else {
          setUserId(data.user.id)
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6" />
        <span>Checking authentication...</span>
      </div>
    )
  }

  if (!userId) return null

  return <AuthenticatedDashboard userId={userId} />
}
