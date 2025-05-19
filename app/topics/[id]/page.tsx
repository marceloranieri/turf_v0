import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Topic {
  id: string
  title: string
  question: string
  category: string
  description: string | null
  last_shown: string | null
  times_shown: number
}

const categoryColors = {
  "Politics": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Technology": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  "Society": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Ethics": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  "Science": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  "Culture": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
  "default": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
}

export default async function TopicPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: topic, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !topic) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{topic.title}</h1>
              <span className={`text-sm px-3 py-1 rounded-full ${
                categoryColors[topic.category] || categoryColors.default
              }`}>
                {topic.category}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Shown {topic.times_shown} times</span>
              {topic.last_shown && (
                <span>
                  Last shown: {new Date(topic.last_shown).toLocaleDateString()}
                </span>
              )}
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <p className="text-lg">{topic.question}</p>

            {topic.description && (
              <>
                <h2 className="text-xl font-semibold mt-8 mb-4">Description</h2>
                <p className="whitespace-pre-wrap">{topic.description}</p>
              </>
            )}
          </div>

          {/* Placeholder for future discussion/comments section */}
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Discussion</h2>
            <p className="text-muted-foreground">
              Discussion features coming soon...
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
