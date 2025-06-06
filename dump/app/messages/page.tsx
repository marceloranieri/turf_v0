"use client"

import { MessageSquare } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Conversations List */}
          <div className="col-span-4 bg-zinc-800/50 rounded-lg p-4">
            <div className="space-y-4">
              {/* Conversation items will go here */}
              <div className="flex items-center gap-3 p-2 rounded hover:bg-zinc-700/50 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                  <span className="text-sm font-bold">J</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-zinc-400 truncate">Hey, how's it going?</p>
                </div>
                <span className="text-xs text-zinc-500">2m</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 bg-zinc-800/50 rounded-lg p-4">
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {/* Messages will go here */}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-zinc-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 