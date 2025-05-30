import SuggestedUsers from "@/components/right-sidebar/SuggestedUsers"
import Trending from "@/components/right-sidebar/Trending"
import Timer from "@/components/Timer"

export default function RightSidebar({ nextRefreshAt }: { nextRefreshAt: Date }) {
  return (
    <aside className="w-full md:w-[300px] p-4 space-y-8">
      <Trending />
      <SuggestedUsers />
      <Timer nextRefreshAt={nextRefreshAt} />
    </aside>
  )
} 