import { getCurrentUser } from "@/lib/auth"
import { getTrendingHighlights, getTopics } from "@/lib/supabase-queries"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const highlights = await getTrendingHighlights()
  const topics = await getTopics()

  return (
    <div className="flex flex-col gap-8 p-6">
      <section className="bg-muted rounded-xl p-6 text-muted-foreground">
        <h1 className="text-lg font-semibold">Welcome to Turf</h1>
        <p>Join the conversation and explore interesting topics.</p>
      </section>

      <section>
        <h2 className="text-md font-bold mb-3">Trending Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, i) => (
            <div key={i} className="rounded-xl border p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-500">@{item.username}</div>
              {item.media_url && (
                <img src={item.media_url} alt="" className="w-full rounded-md my-2" />
              )}
              <div className="font-medium">{item.content}</div>
              <div className="text-xs text-muted-foreground flex gap-3 mt-2">
                <span>💬 {item.replies}</span>
                <span>❤️ {item.reactions}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-md font-bold">Topic Explorer</h2>
          <Link 
            href="/dashboard/all-circles" 
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground text-left">
              <th className="px-4 py-2">Topic</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} className="border-b hover:bg-muted/50">
                <td className="px-4 py-3">
                  <Link 
                    href={`/circle-chatroom/${topic.slug}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {topic.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{topic.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
} 