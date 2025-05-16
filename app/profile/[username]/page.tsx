import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileView } from "@/components/profile-view"

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <DashboardLayout>
      <ProfileView username={params.username} />
    </DashboardLayout>
  )
}
