"use client"

import { ProfileProvider } from "@/context/profile-context"
import { TopicsProvider } from "@/context/topics-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProfileProvider>
      <TopicsProvider>
        {children}
      </TopicsProvider>
    </ProfileProvider>
  )
}
