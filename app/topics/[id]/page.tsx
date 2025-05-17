import { DashboardLayout } from "@/components/dashboard-layout"
import { TopicDetailRealtime } from "@/components/topic-detail-realtime"

export default function TopicDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TopicDetailRealtime topicId={params.id} />
    </DashboardLayout>
  )
}
