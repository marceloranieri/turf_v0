import SidebarTabs from "./Tabs"
import Timer from "@/components/Timer"
import MobileMenu from "./MobileMenu"

export default function RightSidebar({ nextRefreshAt }: { nextRefreshAt: Date }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[320px] p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-base font-semibold">Live Activity</h3>
          <Timer nextRefreshAt={nextRefreshAt} />
        </div>
        <SidebarTabs />
      </aside>

      {/* Mobile menu */}
      <MobileMenu nextRefreshAt={nextRefreshAt} />
    </>
  )
} 