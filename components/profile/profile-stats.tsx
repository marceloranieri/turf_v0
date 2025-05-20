"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, ThumbsUp, TrendingUp } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    topics_count: number;
    comments_count: number;
    followers_count: number;
    following_count: number;
    total_likes: number;
    participation_rate: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: "Topics",
      value: stats.topics_count,
      icon: MessageSquare,
      description: "Topics created",
    },
    {
      label: "Comments",
      value: stats.comments_count,
      icon: MessageSquare,
      description: "Comments made",
    },
    {
      label: "Followers",
      value: stats.followers_count,
      icon: Users,
      description: "People following you",
    },
    {
      label: "Following",
      value: stats.following_count,
      icon: Users,
      description: "People you follow",
    },
    {
      label: "Total Likes",
      value: stats.total_likes,
      icon: ThumbsUp,
      description: "Likes received",
    },
    {
      label: "Participation",
      value: `${Math.round(stats.participation_rate * 100)}%`,
      icon: TrendingUp,
      description: "Active participation rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <item.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 