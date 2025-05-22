"use client";

import { DashboardLayout } from "@/components/dashboard-layout"
import { NotificationsList } from "@/components/notifications-list"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsList />
    </DashboardLayout>
  )
}
