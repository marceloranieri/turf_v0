"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, MessageSquare, TrendingUp, Sparkles, Filter } from "lucide-react"

// Mock data for topics
const TOPICS = [
  {
    id: 1,
    title: "Gaming",
    question: "What's your most memorable gaming experience?",
    activeUsers: 128,
    preview: "I'll never forget the first time I played Ocarina of Time...",
    previewUser: "Alex",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: true,
    category: "entertainment",
  },
  {
    id: 2,
    title: "Movies",
    question: "Which film deserved an Oscar but didn't get one?",
    activeUsers: 94,
    preview: "The Shawshank Redemption was robbed in 1995...",
    previewUser: "Jamie",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: true,
    category: "entertainment",
  },
  {
    id: 3,
    title: "Food & Cooking",
    question: "What's your go-to weeknight dinner recipe?",
    activeUsers: 76,
    preview: "I've been making this 15-minute pasta dish that's absolutely...",
    previewUser: "Sam",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: false,
    category: "lifestyle",
  },
  {
    id: 4,
    title: "Technology",
    question: "How is AI changing your daily work?",
    activeUsers: 215,
    preview: "I've been using AI tools to help with coding and it's been...",
    previewUser: "Taylor",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: true,
    category: "tech",
  },
  {
    id: 5,
    title: "Books",
    question: "What book changed your perspective on life?",
    activeUsers: 62,
    preview: "For me it was 'Sapiens' by Yuval Noah Harari because...",
    previewUser: "Jordan",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: false,
    category: "entertainment",
  },
  {
    id: 6,
    title: "Travel",
    question: "What's your most underrated travel destination?",
    activeUsers: 83,
    preview: "Everyone talks about Paris and Rome, but I think Porto in Portugal...",
    previewUser: "Casey",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: false,
    category: "lifestyle",
  },
  {
    id: 7,
    title: "Music",
    question: "Which artist deserves more recognition?",
    activeUsers: 109,
    preview: "I've been listening to this indie band called...",
    previewUser: "Riley",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: true,
    category: "entertainment",
  },
  {
    id: 8,
    title: "Fitness",
    question: "What's your workout routine?",
    activeUsers: 71,
    preview: "I've been doing a mix of strength training and cardio...",
    previewUser: "Morgan",
    previewUserAvatar: "/placeholder.svg?height=40&width=40",
    isNew: false,
    category: "lifestyle",
  },
]

export function TopicFeed() {
  const [timeLeft, setTimeLeft] = useState("23:45:12")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredTopics, setFilteredTopics] = useState(TOPICS)

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      // This is a mock implementation - in a real app, you'd calculate the actual time remaining
      const [hours, minutes, seconds] = timeLeft.split(":").map(Number)
      let newSeconds = seconds - 1
      let newMinutes = minutes
      let newHours = hours

      if (newSeconds < 0) {
        newSeconds = 59
        newMinutes -= 1
      }

      if (newMinutes < 0) {
        newMinutes = 59
        newHours -= 1
      }

      if (newHours < 0) {
        // Topics expired
        clearInterval(timer)
        return
      }

      setTimeLeft(
        `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${newSeconds
          .toString()
          .padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Filter topics based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredTopics(TOPICS)
    } else {
      setFilteredTopics(TOPICS.filter((topic) => topic.category === activeTab))
    }
  }, [activeTab])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Today's Circles</h1>
          <div className="flex items-center text-sm text-zinc-400 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>Topics refresh in: </span>
            <Badge variant="outline" className="ml-2 text-xs bg-zinc-800/80 text-zinc-300 border-zinc-700">
              {timeLeft}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            All Topics
          </TabsTrigger>
          <TabsTrigger
            value="tech"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            Tech
          </TabsTrigger>
          <TabsTrigger
            value="entertainment"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            Entertainment
          </TabsTrigger>
          <TabsTrigger
            value="lifestyle"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-1.5"
          >
            Lifestyle
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300">
          <Sparkles className="h-4 w-4 mr-2" />
          Discover More Topics
        </Button>
      </div>
    </div>
  )
}

function TopicCard({ topic }: { topic: any }) {
  const [isJoined, setIsJoined] = useState(false)

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50 p-5 hover:bg-zinc-800/70 transition-all hover:border-zinc-600/50 group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold group-hover:text-violet-400 transition-colors">{topic.title}</h3>
            {topic.isNew && (
              <Badge className="ml-2 bg-green-600/20 text-green-400 border-green-600/30 text-xs">New</Badge>
            )}
          </div>
          <p className="text-zinc-300 mt-1 text-sm">{topic.question}</p>
        </div>
        <Button
          variant={isJoined ? "default" : "outline"}
          size="sm"
          className={`${
            isJoined
              ? "bg-violet-600 hover:bg-violet-700 text-white"
              : "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          }`}
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? "Joined" : "Join"}
        </Button>
      </div>

      <div className="flex items-center text-xs text-zinc-400 mb-4">
        <div className="flex items-center mr-4">
          <Users className="h-3.5 w-3.5 mr-1" />
          <span>{topic.activeUsers} active</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          <span>Join conversation</span>
        </div>
        {topic.isNew && (
          <Badge variant="outline" className="ml-auto border-zinc-700 bg-zinc-800/50 text-zinc-400">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            Active
          </Badge>
        )}
      </div>

      <div className="border-t border-zinc-700/50 pt-3">
        <div className="flex items-start">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={topic.previewUserAvatar || "/placeholder.svg"} />
            <AvatarFallback>{topic.previewUser[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <span className="text-sm font-medium">{topic.previewUser}</span>
              <span className="text-xs text-zinc-500 ml-2">just now</span>
            </div>
            <p className="text-sm text-zinc-400 line-clamp-1">{topic.preview}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
