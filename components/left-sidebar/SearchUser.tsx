import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string
  username: string
  nickname: string | null
  avatar_url: string | null
}

export default function SearchUser() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 300)
  const supabase = createClientComponentClient()

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
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    searchUsers(debouncedSearch)
  }, [debouncedSearch, searchUsers])

  const handleResultClick = (user: SearchResult) => {
    // TODO: Implement profile navigation or preview
    console.log("Selected user:", user)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search users..."
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
        {isOpen && (searchTerm || results.length > 0) && (
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
            ) : results.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {results.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleResultClick(user)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">
                        {user.username}
                      </div>
                      {user.nickname && (
                        <div className="text-xs text-zinc-400">
                          {user.nickname}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="p-4 text-sm text-zinc-400 text-center">
                No users found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 