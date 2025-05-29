'use client'

export default function TopicCard({ topic }: { topic: any }) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-150 ease-in-out flex flex-col gap-2">
      <div className="h-40 w-full rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800" />
      <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
      <p className="text-sm text-zinc-400 line-clamp-2">{topic.description || '—'}</p>
      <div className="flex justify-between items-center mt-auto text-xs text-zinc-400">
        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full">
          {topic.category || 'General'}
        </span>
        <span>🔥 Trending</span>
      </div>
    </div>
  )
}
