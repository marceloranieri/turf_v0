"use client"

import { useEffect, useState } from 'react'
import { LeftSidebar } from "@/components/left-sidebar"
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import Timer from '@/components/Timer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useParams } from 'next/navigation'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export default function ChatroomPage() {
  const params = useParams()
  const supabase = useSupabase()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextRefreshAt, setNextRefreshAt] = useState(new Date(Date.now() + REFRESH_INTERVAL))
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load chatroom data after mounting
  useEffect(() => {
    if (!mounted || !supabase) return

    async function loadChatroom() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .eq("id", params.id)
          .single()

        if (error) throw error
        setNextRefreshAt(new Date(Date.now() + REFRESH_INTERVAL))
      } catch (err) {
        console.error('Error loading chatroom:', err)
        setError(err instanceof Error ? err.message : 'Failed to load chatroom')
      } finally {
        setLoading(false)
      }
    }

    loadChatroom()

    // Set up refresh interval
    const interval = setInterval(() => {
      loadChatroom()
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [supabase, mounted, params.id])

  // Return null during SSR to prevent hydration mismatches
  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white">
      <ErrorBoundary>
        <LeftSidebar />
      </ErrorBoundary>
      <div className="flex-1 p-8">
        <ErrorBoundary>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-6"
          >
            <h1 className="text-2xl font-bold tracking-tight">Chatroom</h1>
            <Timer 
              nextRefreshAt={nextRefreshAt}
              size="sm"
              variant="subtle"
              pulseOnEnd
            />
          </motion.div>
        </ErrorBoundary>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ErrorBoundary>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-400 text-center py-8">
                  {error}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Chat messages will go here */}
                </div>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
} 