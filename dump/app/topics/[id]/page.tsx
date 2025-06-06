
export default function TopicDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TopicDetail topicId={params.id} />
    </DashboardLayout>
  )
}
