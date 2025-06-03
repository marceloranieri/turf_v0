export function TopMessageCard() {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 mt-2">
      <div className="flex items-center gap-2 text-xs mb-2 text-muted-foreground">
        <span>1 min ago</span>
        <span>@john_theking55</span>
      </div>
      <p className="text-sm">There's nothing Lennon can't do: fact!</p>
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <div className="flex -space-x-2">
          {[...Array(4)].map((_, i) => (
            <img key={i} className="w-6 h-6 rounded-full border border-black" src="/avatars/default.png" alt="User" />
          ))}
        </div>
        <span>💬 48</span>
      </div>
    </div>
  )
} 