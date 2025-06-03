export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full px-6 py-8 text-white bg-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Today's Circles</h1>
        <span className="text-xs opacity-70">Today's Circles reset in <strong>00h23:10</strong></span>
      </div>
      {children}
    </main>
  )
} 