"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Heart } from "lucide-react"

type TrendingCardProps = {
  id: string
  title: string
  category: string
  engagement_score: number
  created_at?: string
  index?: number
}

export function TrendingCard({ id, title, category, engagement_score, created_at, index = 0 }: TrendingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card
        className="group bg-zinc-800/50 border-zinc-700/50 p-4 hover:bg-zinc-800/70 transition-all duration-150 hover:shadow-lg hover:shadow-zinc-900/20"
      >
        <h3 className="font-medium text-sm mb-2 group-hover:text-white transition-colors">{title}</h3>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <Badge 
            variant="outline" 
            className="bg-zinc-800/80 text-zinc-300 border-zinc-700 group-hover:border-zinc-600 transition-colors"
          >
            {category}
          </Badge>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
              <Heart className="w-3 h-3" />
              <span>{engagement_score}</span>
            </div>
            <div className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
              <MessageSquare className="w-3 h-3" />
              <span>{engagement_score}</span>
            </div>
          </div>
        </div>
        {created_at && (
          <div className="mt-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
            {new Date(created_at).toLocaleDateString()}
          </div>
        )}
      </Card>
    </motion.div>
  )
} 