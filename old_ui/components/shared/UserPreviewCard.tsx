import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface User {
  id: string
  username: string
  nickname: string | null
  avatar_url: string | null
}

interface UserPreviewCardProps {
  user: User
  compact?: boolean
  className?: string
}

export default function UserPreviewCard({ user, compact = false, className }: UserPreviewCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-3",
      compact ? "text-sm" : "text-base",
      className
    )}>
      <Avatar className={cn(
        "transition-transform duration-300 group-hover:scale-110",
        compact ? "h-6 w-6" : "h-8 w-8"
      )}>
        <AvatarImage src={user.avatar_url || undefined} />
        <AvatarFallback>
          {user.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white truncate">
          {user.username}
        </div>
        {user.nickname && (
          <div className="text-xs text-zinc-400 truncate">
            @{user.nickname}
          </div>
        )}
      </div>
    </div>
  )
} 