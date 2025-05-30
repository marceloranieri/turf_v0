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

  const { data: yesterdaysTopics } = await supabase
    .rpc("get_yesterdays_hottest_messages", { date_input: yesterday })

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center gap-4">
          <Input type="text" placeholder="Search debates..." className="w-full" />
          <Button variant="secondary" size="icon">
            <Search />
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Yesterday's Highlights</h2>
        <ul className="space-y-2">
          {yesterdaysTopics?.map((topic: any) => (
            <li
              key={topic.id}
              className="bg-zinc-800 p-4 rounded-lg shadow transition hover:bg-zinc-700"
            >
              <h3 className="font-medium text-lg">{topic.title}</h3>
              <p className="text-sm text-zinc-400">{topic.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
