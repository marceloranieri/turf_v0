"use client"

import { ProfileProvider } from "@/context/profile-context"
import { TopicsProvider } from "@/context/topics-context"
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MyCirclesList from '@/components/MyCirclesList'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-full">
      <div className="w-60 border-r bg-white">
        <MyCirclesList />
      </div>
      <main className="flex-1 overflow-y-auto">
        <ProfileProvider>
          <TopicsProvider>
            {children}
          </TopicsProvider>
        </ProfileProvider>
      </main>
    </div>
  )
}
