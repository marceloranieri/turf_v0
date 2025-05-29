"use client"

import { LeftSidebar } from "@/components/left-sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function MyCirclesPage() {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <LeftSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Circles</h1>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            Join Circle
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Circle cards will go here */}
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Technology</h3>
            <p className="text-zinc-400 text-sm mb-4">Discuss the latest in tech and innovation</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">5 members</span>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 