"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Heart } from "lucide-react"
import { getCategory } from "@/lib/category-colors"

type TrendingCardProps = {
  id: string
  title: string
  category: string
  engagement_score: number
  created_at?: string
  index?: number
}

export function TrendingCard({ id, title, category, engagement_score, created_at, index = 0 }: TrendingCardProps) {
  const categoryInfo = getCategory(category)
  const Icon = categoryInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`group bg-zinc-800/50 border-zinc-700/50 p-4 hover:bg-zinc-800/70 transition-all duration-150 hover:shadow-lg hover:shadow-zinc-900/20 ${categoryInfo.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${categoryInfo.bgColor} ${categoryInfo.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm mb-2 group-hover:text-white transition-colors">{title}</h3>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <Badge 
                variant="outline" 
                className={`${categoryInfo.bgColor} ${categoryInfo.color} ${categoryInfo.borderColor} group-hover:border-zinc-600 transition-colors`}
              >
                {categoryInfo.emoji} {category}
              </Badge>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-3 h-3" />
                  <span>{engagement_score}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>{engagement_score}</span>
                </motion.div>
              </div>
            </div>
            {created_at && (
              <div className="mt-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {new Date(created_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 