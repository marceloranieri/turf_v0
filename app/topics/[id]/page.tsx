import DashboardLayout from '@/components/dashboard-layout'
import { TopicDetail } from "@/components/topic-detail"

export default function TopicDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TopicDetail topicId={params.id} />
    </DashboardLayout>
  )
}
