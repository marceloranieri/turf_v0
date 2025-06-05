'use client'

import { motion } from "framer-motion"
import { categories } from "@/lib/category-colors"

interface CategoryTabsProps {
  selected: string
  setSelected: (category: string) => void
  categories: string[]
}

export default function CategoryTabs({ selected, setSelected, categories: activeCategories }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeCategories.map((category) => {
        const isSelected = category === selected
        const categoryInfo = category === "All" ? null : categories[category]

        return (
          <motion.button
            key={category}
            onClick={() => setSelected(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
              ${isSelected 
                ? categoryInfo 
                  ? `${categoryInfo.bgColor} ${categoryInfo.color} border ${categoryInfo.borderColor}`
                  : "bg-violet-500 text-white"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800/70"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {categoryInfo ? (
              <span className="flex items-center gap-2">
                <span>{categoryInfo.emoji}</span>
                {category}
              </span>
            ) : (
              category
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
