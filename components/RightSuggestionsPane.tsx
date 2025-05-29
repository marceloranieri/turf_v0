"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { UserPlus, TrendingUp, Users } from 'lucide-react'

interface SuggestedUser {
  id: string
  username: string
  avatar_url?: string
  bio?: string
}

interface TrendingTopic {
  id: string
  title: string
  category: string
  active_users: number
}

export default function RightSuggestionsPane() {
  const [suggestedUsers] = useState<SuggestedUser[]>([
    {
      id: '1',
      username: 'alex_tech',
      bio: 'Tech enthusiast & AI researcher',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
    },
    {
      id: '2',
      username: 'sarah_design',
      bio: 'UI/UX Designer & Creative Director',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    {
      id: '3',
      username: 'mike_dev',
      bio: 'Full-stack developer & open source contributor',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    }
  ])

  const [trendingTopics] = useState<TrendingTopic[]>([
    {
      id: '1',
      title: 'The Future of AI in Healthcare',
      category: 'Technology',
      active_users: 245
    },
    {
      id: '2',
      title: 'Sustainable Living Practices',
      category: 'Lifestyle',
      active_users: 189
    },
    {
      id: '3',
      title: 'Web3 and Decentralization',
      category: 'Technology',
      active_users: 156
    }
  ])

  return (
    <div className="w-80 border-l border-zinc-800 p-6 bg-zinc-900/50">
      {/* Trending Topics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          <h2 className="text-lg font-semibold">Trending Topics</h2>
        </div>
        <div className="space-y-4">
          {trendingTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <h3 className="font-medium text-sm mb-1">{topic.title}</h3>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{topic.category}</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {topic.active_users}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-violet-500" />
          <h2 className="text-lg font-semibold">Suggested Users</h2>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">@{user.username}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-1">{user.bio}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 