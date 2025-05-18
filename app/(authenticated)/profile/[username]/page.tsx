"use client";

import { ProfileView } from "@/components/profile-view"

export default function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  return <ProfileView username={params.username} />
}
