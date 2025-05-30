"use client"

import { useState } from "react"
import { Flame, Users } from "lucide-react"
import Trending from "./Trending"
import SuggestedUsers from "./SuggestedUsers"
import { motion, AnimatePresence } from "framer-motion"

export default function SidebarTabs() {
  const [activeTab, setActiveTab] = useState<"trending" | "users">("trending")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-zinc-700 pb-2">
        <button
          onClick={() => setActiveTab("trending")}
          className={`flex items-center gap-2 text-sm font-medium ${
            activeTab === "trending"
              ? "text-white border-b-2 border-white"
              : "text-zinc-500 hover:text-zinc-300"
          } pb-1 transition`}
        >
          <Flame size={16} />
          Trending topics
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 text-sm font-medium ${
            activeTab === "users"
              ? "text-white border-b-2 border-white"
              : "text-zinc-500 hover:text-zinc-300"
          } pb-1 transition`}
        >
          <Users size={16} />
          Who to follow
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "trending" && <Trending />}
          {activeTab === "users" && <SuggestedUsers />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 