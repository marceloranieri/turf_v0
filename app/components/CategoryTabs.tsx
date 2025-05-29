'use client'
import React from 'react'

export default function CategoryTabs({
  selected,
  setSelected,
}: {
  selected: string
  setSelected: (v: string) => void
}) {
  const categories = ['All', 'Tech', 'Design', 'Lifestyle', 'Gaming']

  return (
    <div className="flex gap-3 mt-4 text-sm">
      {categories.map((tab) => (
        <button
          key={tab}
          className={`px-3 py-1 rounded-full transition-all ${
            selected === tab
              ? 'bg-white text-black'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
          onClick={() => setSelected(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
} 