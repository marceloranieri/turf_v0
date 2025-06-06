"use client"

import { Bookmark } from "lucide-react"

export default function BookmarksPage() {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Bookmark className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Bookmarks</h1>
        </div>

        <div className="grid gap-6">
          {/* Bookmarked items will go here */}
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center">
                <span className="text-sm font-bold">T</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">The Future of AI in Education</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  A deep dive into how artificial intelligence is transforming the way we learn and teach...
                </p>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span>Technology Circle</span>
                  <span>•</span>
                  <span>Saved 2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 