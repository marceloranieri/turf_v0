"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Target, Clock } from "lucide-react";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { AchievementService } from "@/lib/achievements/service";
import { AchievementProgress } from "@/lib/achievements/types";

interface ProfileAchievementsTabProps {
  userId: string;
}

export function ProfileAchievementsTab({ userId }: ProfileAchievementsTabProps) {
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<AchievementProgress[]>([]);
  const [nextAchievements, setNextAchievements] = useState<AchievementProgress[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const achievementService = new AchievementService();
  
  useEffect(() => {
    async function loadAchievements() {
      try {
        setLoading(true);
        setError(null);
        
        const [allAchievements, recent, next, points] = await Promise.all([
          achievementService.getUserAchievements(userId),
          achievementService.getRecentAchievements(userId),
          achievementService.getNextAchievements(userId),
          achievementService.getUserPoints(userId)
        ]);
        
        setAchievements(allAchievements);
        setRecentAchievements(recent);
        setNextAchievements(next);
        setTotalPoints(points);
      } catch (err) {
        console.error("Error loading achievements:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    loadAchievements();
  }, [userId]);
  
  const completedAchievements = achievements.filter(a => a.completed);
  const inProgressAchievements = achievements.filter(a => !a.completed);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="animate-pulse bg-zinc-800 h-6 w-48 rounded"></CardTitle>
            <CardDescription className="animate-pulse bg-zinc-800 h-4 w-72 rounded"></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-zinc-800/30 animate-pulse rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Error loading achievements</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            className="text-sm text-zinc-400 hover:text-white"
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Track your progress and earn rewards
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-zinc-400">
                {totalPoints} total points
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="next" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Next
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                In Progress
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <AchievementCard 
                    key={achievement.achievement.id} 
                    achievement={achievement}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAchievements.map((achievement) => (
                  <AchievementCard 
                    key={achievement.achievement.id} 
                    achievement={achievement}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="next" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nextAchievements.map((achievement) => (
                  <AchievementCard 
                    key={achievement.achievement.id} 
                    achievement={achievement}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressAchievements.map((achievement) => (
                  <AchievementCard 
                    key={achievement.achievement.id} 
                    achievement={achievement}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 