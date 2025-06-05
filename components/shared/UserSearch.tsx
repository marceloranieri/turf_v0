import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import UserPreviewCard from "./UserPreviewCard"

interface User {
  id: string
  username: string
  nickname: string | null
  avatar_url: string | null
}

interface UserSearchProps {
  placeholder?: string
  onSelect?: (user: User) => void
  compact?: boolean
  className?: string
  showFollowButton?: boolean
  onFollow?: (user: User) => void
}

const RECENT_SEARCHES_KEY = "recent_user_searches"
const MAX_RECENT_SEARCHES = 5

export default function UserSearch({
  placeholder = "Search users...",
  onSelect,
  compact = false,
  className,
  showFollowButton = false,
  onFollow
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<User[]>([])
  const [recentSearches, setRecentSearches] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 300)
  const supabase = createClientComponentClient()

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (error) {
        console.error("Error parsing recent searches:", error)
      }
    }
  }, [])

  const storeRecentSearch = useCallback((user: User) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(u => u.id !== user.id)
      const updated = [user, ...filtered].slice(0, MAX_RECENT_SEARCHES)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, nickname, avatar_url")
        .order("points", { ascending: false })
        .limit(5)

      if (error) throw error
    } catch (error) {
      console.error("Error fetching trending users:", error)
    }
  }, [supabase])

  const searchUsers = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, nickname, avatar_url")
        .or(`username.ilike.%${term}%,nickname.ilike.%${term}%`)
        .limit(5)

      if (error) throw error
      setResults(data || [])
      if (data?.[0]) storeRecentSearch(data[0])
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, storeRecentSearch])

  useEffect(() => {
    if (debouncedSearch) {
      searchUsers(debouncedSearch)
    } else {
    }

  const handleResultClick = (user: User) => {
    onSelect?.(user)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleFollow = (e: React.MouseEvent, user: User) => {
    e.stopPropagation()
    onFollow?.(user)
  }

  const usersToShow = debouncedSearch ? results : trendingUsers

  return (
    <div className={cn("relative", compact ? "w-full" : "w-[300px]", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 bg-zinc-900/50 border-zinc-800 text-sm"
        />
      </div>

      <AnimatePresence>
        {isOpen && (searchTerm || usersToShow.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 rounded-md border border-zinc-800 shadow-lg overflow-hidden z-50"
          >
            {loading ? (
              <div className="p-4 text-sm text-zinc-400 text-center">
                Searching...
              </div>
            ) : usersToShow.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {!debouncedSearch && (
                  <div className="px-3 py-2 text-xs text-zinc-500 border-b border-zinc-800">
                  </div>
                )}
                {usersToShow.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleResultClick(user)}
                    className="w-full p-3 flex items-center justify-between gap-3 hover:bg-zinc-800/50 transition-colors group"
                  >
                    <UserPreviewCard user={user} compact={compact} />
                    {showFollowButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleFollow(e, user)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </Button>
                    )}
                  </button>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="p-4 text-sm text-zinc-400 text-center">
                No users found
              </div>
            ) : null}

            {!debouncedSearch && recentSearches.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs text-zinc-500 border-t border-zinc-800">
                  <Clock className="inline-block h-3 w-3 mr-1" />
                  Recent Searches
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {recentSearches.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleResultClick(user)}
                      className="w-full p-3 flex items-center justify-between gap-3 hover:bg-zinc-800/50 transition-colors group"
                    >
                      <UserPreviewCard user={user} compact={compact} />
                      {showFollowButton && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleFollow(e, user)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Follow
                        </Button>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 