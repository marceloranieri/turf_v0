"use client"

import { LeftSidebar } from "@/components/left-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { format, subDays } from "date-fns"

export default async function ExplorePage() {
  const supabase = createServerComponentClient({ cookies })

  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd")

  // Fetch yesterday's top-voted messages (join with topics)
  const { data: yesterdaysTopics } = await supabase
    .rpc("get_yesterdays_hottest_messages", { date_input: yesterday })

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />

      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center gap-4">
          <Search className="h-5 w-5 text-zinc-400" />
          <Input placeholder="Search debates or people..." />
          <Button variant="secondary">Search</Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Yesterday’s Top Discussions</h2>

        <div className="grid grid-cols-1 gap-4">
          {yesterdaysTopics?.map((topic: any) => (
            <div key={topic.id} className="rounded-lg border border-zinc-700 p-4 hover:bg-zinc-800 transition">
              <h3 className="text-lg font-medium">{topic.topic_title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{topic.message}</p>
              <p className="text-xs text-zinc-500 mt-2">👍 {topic.upvotes}</p>
            </div>
          ))}

          {!yesterdaysTopics?.length && (
            <p className="text-zinc-400">No hot topics from yesterday yet.</p>
          )}
        </div>
      </main>
    </div>
  )
}
