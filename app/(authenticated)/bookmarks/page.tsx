"use client";

import { DashboardLayout } from "@/components/dashboard-layout"
import { BookmarksList } from "@/components/bookmarks-list"

export default function BookmarksPage() {
  return (
    <DashboardLayout>
      <BookmarksList />
    </DashboardLayout>
  )
} 