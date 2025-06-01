import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { retryWithBackoff } from "@/lib/retry"
import { RefreshCw } from "lucide-react"

interface LeaderboardUser {
  id: string
  username: string
  avatar_url: string | null
  points: number
  circle_name: string
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [previousRankings, setPreviousRankings] = useState<Record<string, number>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClientComponentClient()

  const fetchLeaderboard = async () => {
    try {
      setIsRefreshing(true)
      const { data, error } = await retryWithBackoff(() =>
        supabase
          .rpc('get_leaderboard_data')
          .limit(5)
      )

      if (error) throw error

      // Update rankings and trigger animations
      const newRankings = data?.reduce((acc, user, index) => {
        acc[user.id] = index + 1
        return acc
      }, {} as Record<string, number>) || {}

      // Check for new top performers
      data?.forEach((user, index) => {
        const prevRank = previousRankings[user.id]
        if (prevRank && prevRank > index + 1) {
          // User moved up in rankings
          if (index === 0) {
            // New #1 - trigger confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            })
          }
        }
      })

      setPreviousRankings(newRankings)
      setUsers(data || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      setError(error as Error)
      toast.error('Failed to load leaderboard. Retrying...')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('leaderboard')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'message_votes' 
        }, 
        () => {
          fetchLeaderboard()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Handle manual refresh with Cmd/Ctrl + R
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault()
        fetchLeaderboard()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-white text-base font-semibold">Top Performers</h3>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-base font-semibold">Top Performers</h3>
          <button
            onClick={fetchLeaderboard}
            className="text-zinc-400 hover:text-white transition-colors"
            title="Refresh leaderboard"
            aria-label="Refresh leaderboard"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-zinc-500 italic">
          Failed to load leaderboard. Click refresh to try again.
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-white text-base font-semibold">Top Performers</h3>
        <div className="text-sm text-zinc-500 italic">No data available yet</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-base font-semibold">Top Performers</h3>
        <button
          onClick={fetchLeaderboard}
          className={cn(
            "text-zinc-400 hover:text-white transition-colors",
            isRefreshing && "animate-spin"
          )}
          title="Refresh leaderboard"
          aria-label="Refresh leaderboard"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <Avatar className={cn(
                  "h-8 w-8 transition-all duration-300",
                  index === 0 && "ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-zinc-900"
                )}>
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {index < 3 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]",
                      index === 0 && "bg-yellow-500 text-zinc-900"
                    )}
                  >
                    {index + 1}
                  </Badge>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user.username}
                </div>
                <div className="text-xs text-zinc-500 truncate">
                  {user.circle_name}
                </div>
              </div>
              <motion.div 
                className="text-sm font-medium text-white"
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                key={user.points}
              >
                {user.points}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 