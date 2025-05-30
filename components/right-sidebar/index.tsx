import SidebarTabs from "./Tabs"
import Timer from "@/components/Timer"

export default function RightSidebar({ nextRefreshAt }: { nextRefreshAt: Date }) {
  return (
    <aside className="w-full md:w-[320px] p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-base font-semibold">Live Activity</h3>
        <Timer nextRefreshAt={nextRefreshAt} />
      </div>
      <SidebarTabs />
    </aside>
  )
} 