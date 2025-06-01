import SidebarTabs from "./Tabs"
import Timer from "@/components/Timer"
import dynamic from "next/dynamic"

const Trending = dynamic(() => import("./Trending"), { ssr: false })
const SuggestedUsers = dynamic(() => import("./SuggestedUsers"), { ssr: false })
const Leaderboard = dynamic(() => import("./Leaderboard"), { ssr: false })
const Radar = dynamic(() => import("./Radar"), { ssr: false })

export default function RightSidebar({ nextRefreshAt }: { nextRefreshAt: Date }) {
  return (
    <aside className="w-full md:w-[320px] p-4 space-y-6">
      {/* Timer Row with Label */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-base font-semibold">Topics reset in</h3>
        <Timer 
          nextRefreshAt={nextRefreshAt} 
          compact 
          showPulseOnFinal10 
          darkBlurBackground 
        />
      </div>

      {/* Tabs: Trending + Who to follow */}
      <SidebarTabs />

      {/* Content Blocks */}
      <div className="space-y-4">
        <Trending />
        <SuggestedUsers />
        <Leaderboard />
        <Radar />
      </div>
    </aside>
  )
} 