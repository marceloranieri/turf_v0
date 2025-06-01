import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  ThumbsUp, 
  UserPlus,
  AtSign,
  SmilePlus,
  RefreshCw
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { retryWithBackoff } from "@/lib/retry"

interface Notification {
  id: string
  type: 'follow' | 'like' | 'message' | 'upvote' | 'mention' | 'reaction'
  user: {
    id: string
    username: string
    avatar_url: string | null
  }
  created_at: string
  content?: string
}

const notificationIcons = {
  follow: UserPlus,
  like: Heart,
  message: MessageSquare,
  upvote: ThumbsUp,
  mention: AtSign,
  reaction: SmilePlus
}

const notificationColors = {
  follow: "text-blue-500",
  like: "text-pink-500",
  message: "text-green-500",
  upvote: "text-yellow-500",
  mention: "text-purple-500",
  reaction: "text-orange-500"
}

export default function Radar() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClientComponentClient()

  const fetchNotifications = async () => {
    try {
      setIsRefreshing(true)
      const { data, error } = await retryWithBackoff(() =>
        supabase
          .from('notifications')
          .select(`
            id,
            type,
            created_at,
            content,
            user:users (
              id,
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      )

      if (error) throw error
      setNotifications(data || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError(error as Error)
      toast.error('Failed to load notifications. Retrying...')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 5))
      })
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
        fetchNotifications()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-white text-base font-semibold">Live Activity</h3>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-3 w-[120px]" />
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
          <h3 className="text-white text-base font-semibold">Live Activity</h3>
          <button
            onClick={fetchNotifications}
            className="text-zinc-400 hover:text-white transition-colors"
            title="Refresh notifications"
            aria-label="Refresh notifications"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-zinc-500 italic">
          Failed to load notifications. Click refresh to try again.
        </div>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-white text-base font-semibold">Live Activity</h3>
        <div className="text-sm text-zinc-500 italic">No recent activity</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-base font-semibold">Live Activity</h3>
        <button
          onClick={fetchNotifications}
          className={cn(
            "text-zinc-400 hover:text-white transition-colors",
            isRefreshing && "animate-spin"
          )}
          title="Refresh notifications"
          aria-label="Refresh notifications"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type]
            const iconColor = notificationColors[notification.type]
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 group"
              >
                <Avatar className="h-8 w-8 transition-transform duration-300 group-hover:scale-110">
                  <AvatarImage src={notification.user.avatar_url || undefined} />
                  <AvatarFallback>{notification.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {notification.user.username}
                    </span>
                    <Icon className={cn("h-4 w-4 transition-colors duration-300", iconColor)} />
                  </div>
                  {notification.content && (
                    <motion.div 
                      className="text-xs text-zinc-500 truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {notification.content}
                    </motion.div>
                  )}
                  <motion.div 
                    className="text-[10px] text-zinc-600 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {new Date(notification.created_at).toLocaleTimeString()}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
} 