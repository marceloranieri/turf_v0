
export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <DashboardLayout>
      <ProfileView username={params.username} />
    </DashboardLayout>
  )
}
