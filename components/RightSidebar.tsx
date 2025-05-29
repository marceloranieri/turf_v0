'use client'

export default function RightSidebar() {
  const suggestions = [
    { name: 'Kohaku', desc: 'I design digital products and ventures.', handle: '@kohaku' },
    { name: 'Lola Rohan', desc: 'Startup mentor and community builder.', handle: '@lola.rohan' },
  ]

  return (
    <aside className="hidden xl:block w-80 pl-6 border-l border-zinc-800">
      <h2 className="text-white text-sm mb-2 font-semibold">You Might Like</h2>
      <div className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.handle} className="bg-zinc-900 rounded-xl p-4">
            <div className="text-white font-medium">{user.name}</div>
            <div className="text-zinc-400 text-sm">{user.desc}</div>
            <button className="mt-2 px-3 py-1 text-sm rounded bg-white text-black">Follow</button>
          </div>
        ))}
      </div>
    </aside>
  )
}
