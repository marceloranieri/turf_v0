"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MoreHorizontal,
  Heart,
  MessageSquare,
  Share2,
  ChevronUp,
  ChevronDown,
  LinkIcon,
  Calendar,
  Edit,
  Bookmark,
  Star,
} from "lucide-react"

// Mock user profile data
const USER_PROFILE = {
  username: "Moyo Shiro",
  handle: "@moyoshiro",
  avatar: "/diverse-avatars.png",
  banner: "/majestic-mountain-vista.png",
  bio: "UI/UX Designer 🎨 | Creating digital experiences that spark joy ✨ | Design systems enthusiast | Currently @TurfDesign",
  website: "moyoshiro.design",
  joinDate: "Joined March 2023",
  isOwnProfile: true,
  stats: {
    posts: 248,
    followers: 1243,
    following: 567,
  },
}

// Mock user posts data
const USER_POSTS = [
  {
    id: 1,
    content:
      "Just finished this new design system for a client. Really proud of how the components turned out. What do you think? #DesignSystems #UI",
    image: "/placeholder-aqt3l.png",
    timestamp: "2h ago",
    topic: "Design",
    votes: 42,
    upvoted: true,
    downvoted: false,
    comments: 12,
    shares: 5,
    reactions: [
      { emoji: "❤️", count: 18 },
      { emoji: "👍", count: 14 },
      { emoji: "🔥", count: 8 },
    ],
  },
  {
    id: 2,
    content:
      "Unpopular opinion: Flat design isn't dead, it's just evolving. The trend toward \"neumorphism\" is interesting but has serious accessibility issues that designers need to address.",
    timestamp: "Yesterday",
    topic: "Design Trends",
    votes: 36,
    upvoted: false,
    downvoted: false,
    comments: 24,
    shares: 7,
    reactions: [
      { emoji: "🤔", count: 12 },
      { emoji: "👏", count: 9 },
    ],
  },
  {
    id: 3,
    content:
      "Working on some micro-interactions for this mobile app. Small details make a big difference in how the product feels. #UX #Animation",
    image: "/placeholder-7lyq8.png",
    timestamp: "3 days ago",
    topic: "UX Design",
    votes: 58,
    upvoted: false,
    downvoted: false,
    comments: 8,
    shares: 12,
    reactions: [
      { emoji: "✨", count: 22 },
      { emoji: "❤️", count: 15 },
    ],
  },
  {
    id: 4,
    content:
      'Just read "Design Systems" by Alla Kholmatova. Highly recommend for anyone working on design systems or component libraries. So many practical insights!',
    timestamp: "1 week ago",
    topic: "Books",
    votes: 29,
    upvoted: false,
    downvoted: false,
    comments: 6,
    shares: 4,
    reactions: [
      { emoji: "📚", count: 8 },
      { emoji: "👍", count: 11 },
    ],
  },
]

// Mock featured posts
const FEATURED_POSTS = [
  {
    id: 101,
    content:
      "My thoughts on the future of design tools. We need better collaboration features and real-time feedback loops between designers and developers. Thread 🧵👇",
    timestamp: "2 weeks ago",
    topic: "Design Tools",
    votes: 124,
    upvoted: false,
    downvoted: false,
    comments: 45,
    shares: 32,
    reactions: [
      { emoji: "💯", count: 38 },
      { emoji: "🧠", count: 22 },
    ],
    pinned: true,
  },
  {
    id: 102,
    content:
      "I created this accessibility checklist for designers. Feel free to use it in your projects! #A11y #InclusiveDesign",
    image: "/placeholder-2ltz4.png",
    timestamp: "1 month ago",
    topic: "Accessibility",
    votes: 215,
    upvoted: false,
    downvoted: false,
    comments: 28,
    shares: 76,
    reactions: [
      { emoji: "🙏", count: 45 },
      { emoji: "❤️", count: 38 },
    ],
    pinned: true,
  },
]

// Mock media posts
const MEDIA_POSTS = [
  {
    id: 201,
    image: "/placeholder-2uqtf.png",
    timestamp: "3 days ago",
    votes: 42,
  },
  {
    id: 202,
    image: "/placeholder-1ka2k.png",
    timestamp: "1 week ago",
    votes: 38,
  },
  {
    id: 203,
    image: "/placeholder.svg?height=300&width=300&query=ui+design+3",
    timestamp: "2 weeks ago",
    votes: 56,
  },
  {
    id: 204,
    image: "/placeholder.svg?height=300&width=300&query=ui+design+4",
    timestamp: "3 weeks ago",
    votes: 29,
  },
  {
    id: 205,
    image: "/placeholder.svg?height=300&width=300&query=ui+design+5",
    timestamp: "1 month ago",
    votes: 64,
  },
  {
    id: 206,
    image: "/placeholder.svg?height=300&width=300&query=ui+design+6",
    timestamp: "1 month ago",
    votes: 47,
  },
]

export function ProfileView({ username }: { username: string }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  // Animation for tab switching
  const [tabAnimation, setTabAnimation] = useState("")

  useEffect(() => {
    setTabAnimation("animate-in fade-in-0 slide-in-from-bottom-2 duration-300")
    const timer = setTimeout(() => {
      setTabAnimation("")
    }, 300)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleVote = (postId: number, isUpvote: boolean) => {
    // Handle voting logic here
    console.log(`Voted ${isUpvote ? "up" : "down"} on post ${postId}`)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Profile Header */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-48 md:h-64 w-full overflow-hidden relative">
          <Image
            src={USER_PROFILE.banner || "/placeholder.svg"}
            alt="Profile banner"
            className="w-full object-cover"
            width={1200}
            height={300}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/70"></div>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 pb-4 -mt-16">
          <div className="flex flex-col md:flex-row md:items-end">
            {/* Avatar */}
            <Avatar className="h-28 w-28 border-4 border-zinc-900 relative z-10">
              <AvatarImage src={USER_PROFILE.avatar || "/placeholder.svg"} alt={USER_PROFILE.username} />
              <AvatarFallback>{USER_PROFILE.username[0]}</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="mt-3 md:mt-0 md:ml-4 md:flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{USER_PROFILE.username}</h1>
                  <p className="text-zinc-400">{USER_PROFILE.handle}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 md:mt-0 flex space-x-2">
                  {USER_PROFILE.isOwnProfile ? (
                    <Button variant="outline" className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      className={
                        isFollowing
                          ? "bg-zinc-800/50 border-zinc-700/50 text-zinc-300"
                          : "bg-violet-600 hover:bg-violet-700"
                      }
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio and Stats */}
          <div className="mt-4 space-y-3">
            <p className="text-zinc-300">{USER_PROFILE.bio}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              {USER_PROFILE.website && (
                <a
                  href={`https://${USER_PROFILE.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-violet-400 transition-colors"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  {USER_PROFILE.website}
                </a>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {USER_PROFILE.joinDate}
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <span className="font-semibold">{USER_PROFILE.stats.posts}</span>
                <span className="ml-1 text-zinc-400">Posts</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{USER_PROFILE.stats.followers}</span>
                <span className="ml-1 text-zinc-400">Followers</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{USER_PROFILE.stats.following}</span>
                <span className="ml-1 text-zinc-400">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-zinc-800/50 px-4">
        <Tabs
          defaultValue="posts"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value)
          }}
        >
          <TabsList className="bg-transparent border-b-0 p-0 h-auto">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-white px-4 py-3"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-white px-4 py-3"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-white px-4 py-3"
            >
              Media
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className={`mt-4 space-y-6 ${tabAnimation}`}>
            {USER_POSTS.map((post) => (
              <PostCard key={post.id} post={post} onVote={handleVote} />
            ))}
          </TabsContent>

          {/* Featured Tab */}
          <TabsContent value="featured" className={`mt-4 space-y-6 ${tabAnimation}`}>
            {FEATURED_POSTS.map((post) => (
              <PostCard key={post.id} post={post} onVote={handleVote} />
            ))}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className={`mt-4 ${tabAnimation}`}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MEDIA_POSTS.map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PostCard({ post, onVote }: { post: any; onVote: (postId: number, isUpvote: boolean) => void }) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  const reactions = [
    { emoji: "👍", label: "Thumbs Up" },
    { emoji: "❤️", label: "Heart" },
    { emoji: "😂", label: "Laugh" },
    { emoji: "😮", label: "Wow" },
    { emoji: "🎉", label: "Celebrate" },
    { emoji: "✨", label: "Sparkles" },
  ]

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 hover:bg-zinc-800/70 transition-all">
      {post.pinned && (
        <div className="flex items-center text-xs text-zinc-400 mb-2">
          <Star className="h-3 w-3 mr-1 fill-violet-500 text-violet-500" />
          <span>Pinned post</span>
        </div>
      )}

      <div className="flex">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={USER_PROFILE.avatar || "/placeholder.svg"} alt={USER_PROFILE.username} />
          <AvatarFallback>{USER_PROFILE.username[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-medium">{USER_PROFILE.username}</span>
            <span className="ml-1 text-zinc-400 text-sm">{USER_PROFILE.handle}</span>
            <span className="mx-1 text-zinc-500">·</span>
            <span className="text-sm text-zinc-500">{post.timestamp}</span>
            <Badge className="ml-2 text-xs bg-zinc-700/50 text-zinc-300 border-zinc-600/50">{post.topic}</Badge>
          </div>

          <p className="mt-2 text-zinc-300">{post.content}</p>

          {post.image && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Post content"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Reactions */}
          {post.reactions && post.reactions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.reactions.map((reaction: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                >
                  {reaction.emoji} {reaction.count}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center">
            {/* Voting */}
            <div className="flex items-center mr-4 bg-zinc-800/50 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-r-none ${
                  post.upvoted ? "text-green-500" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => onVote(post.id, true)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>

              <span className="px-2 text-sm font-medium">{post.votes}</span>

              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-l-none ${
                  post.downvoted ? "text-red-500" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => onVote(post.id, false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Comment button */}
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white h-8">
              <MessageSquare className="h-4 w-4 mr-1" />
              {post.comments > 0 && <span className="text-xs">{post.comments}</span>}
            </Button>

            {/* Reaction button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white h-8"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
              >
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-xs">React</span>
              </Button>

              {showReactionPicker && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-zinc-800 rounded-md border border-zinc-700 flex gap-1 z-10">
                  {reactions.map((reaction) => (
                    <TooltipProvider key={reaction.emoji}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="text-lg hover:bg-zinc-700 p-1 rounded-md cursor-pointer"
                            onClick={() => {
                              setShowReactionPicker(false)
                            }}
                          >
                            {reaction.emoji}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>{reaction.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </div>

            {/* Share button */}
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white h-8 ml-auto">
              <Share2 className="h-4 w-4 mr-1" />
              {post.shares > 0 && <span className="text-xs">{post.shares}</span>}
            </Button>

            {/* Bookmark button */}
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white h-8">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MediaCard({ media }: { media: any }) {
  return (
    <div className="relative group overflow-hidden rounded-lg aspect-square">
      <Image
        src={media.image || "/placeholder.svg"}
        alt="Media content"
        width={300}
        height={300}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <div className="flex items-center text-sm text-white">
          <ChevronUp className="h-3 w-3 mr-1" />
          <span>{media.votes}</span>
          <span className="mx-2">•</span>
          <span className="text-xs">{media.timestamp}</span>
        </div>
      </div>
    </div>
  )
}
