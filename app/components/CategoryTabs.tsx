import React from 'react'

const CATEGORIES = ['All', 'Tech', 'Design', 'Lifestyle', 'Gaming'] as const
export type Category = typeof CATEGORIES[number]

interface CategoryTabsProps {
  selectedCategory: Category
  onSelectCategory: (category: Category) => void
}

export default function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${selectedCategory === category
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
} 