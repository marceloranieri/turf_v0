<<<<<<< HEAD
"use client"

import { LeftSidebar } from "@/components/left-sidebar"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
=======
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { format, subDays } from 'date-fns'
import { LeftSidebar } from '@/components/left-sidebar'
import RightSuggestionsPane from '@/components/RightSuggestionsPane'
import TodaysTopicCard from '@/components/turf/todays-topic-card'
import YesterdaysTopicCard from '@/components/turf/yesterdays-topic-card'

export default async function ExplorePage() {
  const supabase = createServerComponentClient({ cookies })

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Fetch today's topics
  const { data: todaysTopics } = await supabase
    .from('topics')
    .select('id, title, category, image_url, slug')
    .eq('date', today)
    .order('created_at', { ascending: false })

  // Fetch yesterday's top-voted messages (join with topics)
  const { data: yesterdaysTopics } = await supabase
    .rpc('get_yesterdays_hottest_messages', { date_input: yesterday })
>>>>>>> 5eb66af (feat: Add Explore page with server-side data fetching and topic cards)

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />
<<<<<<< HEAD
      <main className="flex-1 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Compass className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Explore</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search circles, topics, or users..."
              className="pl-10 bg-zinc-800/50 border-zinc-700"
            />
          </div>
        </div>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <Button variant="outline" className="whitespace-nowrap">Technology</Button>
            <Button variant="outline" className="whitespace-nowrap">Science</Button>
            <Button variant="outline" className="whitespace-nowrap">Philosophy</Button>
            <Button variant="outline" className="whitespace-nowrap">Culture</Button>
            <Button variant="outline" className="whitespace-nowrap">Business</Button>
          </div>
        </section>

        {/* Popular Circles */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Circles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Circle cards will go here */}
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">AI & Machine Learning</h3>
              <p className="text-zinc-400 text-sm mb-4">Discuss the latest in AI research and applications</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">1.2k members</span>
                <Button variant="outline" size="sm">Join</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
          <div className="grid gap-4">
            {/* Topic cards will go here */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">The Ethics of AI in Healthcare</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Exploring the moral implications of AI-driven medical decisions...
              </p>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span>AI & ML Circle</span>
                <span>•</span>
                <span>245 discussions</span>
              </div>
            </div>
          </div>
        </section>
      </main>
=======
      
      {/* Main content area */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Explore</h1>

        {/* Today's Topics */}
        <div className="mb-12">
          <h2 className="text-lg text-zinc-300 mb-6">Today's Topics</h2>
          {todaysTopics?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {todaysTopics.map((topic) => (
                <TodaysTopicCard
                  key={topic.id}
                  title={topic.title}
                  imageUrl={topic.image_url}
                  category={topic.category}
                  joinUrl={`/circles/${topic.slug}`}
                  shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/circles/${topic.slug}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8">No trending topics yet.</p>
          )}
        </div>

        {/* Yesterday's Hottest Circles */}
        <div>
          <h2 className="text-lg text-zinc-300 mb-6">🔥 Yesterday's Hottest Circles</h2>
          {yesterdaysTopics?.length ? (
            <div className="space-y-4">
              {yesterdaysTopics.map((topic) => (
                <YesterdaysTopicCard
                  key={topic.id}
                  topicTitle={topic.topic_title}
                  messageContent={topic.message}
                  messageUser={topic.username}
                  upvotes={topic.upvotes}
                  joinUrl={`/circles/${topic.slug}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8">No highlights from yesterday.</p>
          )}
        </div>
      </div>

      <RightSuggestionsPane />
>>>>>>> 5eb66af (feat: Add Explore page with server-side data fetching and topic cards)
    </div>
  )
} 