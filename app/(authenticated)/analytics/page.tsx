import { Metadata } from "next";
import { TopicAnalytics } from "@/components/topics/topic-analytics";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Turf",
  description: "View detailed analytics about topics, participation, and engagement on Turf.",
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <TopicAnalytics />
    </div>
  );
} 