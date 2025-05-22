import { createClient } from "@/lib/supabase/client";
import { Achievement, UserAchievement, AchievementProgress } from "./types";

export class AchievementService {
  private supabase = createClient();
  
  async getUserAchievements(userId: string): Promise<AchievementProgress[]> {
    const { data: userAchievements, error } = await this.supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", userId);
      
    if (error) throw error;
    
    return (userAchievements as (UserAchievement & { achievement: Achievement })[]).map(ua => ({
      achievement: ua.achievement,
      progress: ua.progress,
      completed: ua.completed_at !== null,
      completed_at: ua.completed_at
    }));
  }
  
  async getUserPoints(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from("user_points")
      .select("total_points")
      .eq("user_id", userId)
      .single();
      
    if (error) throw error;
    return data.total_points;
  }
  
  async updateAchievementProgress(
    userId: string,
    type: string,
    increment: number = 1
  ): Promise<void> {
    // Get all achievements of the specified type
    const { data: achievements, error: achievementsError } = await this.supabase
      .from("achievements")
      .select("*")
      .eq("type", type);
      
    if (achievementsError) throw achievementsError;
    
    // For each achievement, update or create user achievement progress
    for (const achievement of achievements) {
      const { data: existingProgress, error: progressError } = await this.supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId)
        .eq("achievement_id", achievement.id)
        .single();
        
      if (progressError && progressError.code !== "PGRST116") throw progressError;
      
      const newProgress = (existingProgress?.progress || 0) + increment;
      const isCompleted = newProgress >= achievement.requirement;
      
      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await this.supabase
          .from("user_achievements")
          .update({
            progress: newProgress,
            completed_at: isCompleted && !existingProgress.completed_at ? new Date().toISOString() : existingProgress.completed_at
          })
          .eq("id", existingProgress.id);
          
        if (updateError) throw updateError;
      } else {
        // Create new progress
        const { error: insertError } = await this.supabase
          .from("user_achievements")
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            progress: newProgress,
            completed_at: isCompleted ? new Date().toISOString() : null
          });
          
        if (insertError) throw insertError;
      }
    }
  }
  
  async getAchievementProgress(
    userId: string,
    achievementId: string
  ): Promise<AchievementProgress | null> {
    const { data, error } = await this.supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single();
      
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    
    return {
      achievement: data.achievement,
      progress: data.progress,
      completed: data.completed_at !== null,
      completed_at: data.completed_at
    };
  }
  
  async getRecentAchievements(userId: string, limit: number = 5): Promise<AchievementProgress[]> {
    const { data, error } = await this.supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return data.map(ua => ({
      achievement: ua.achievement,
      progress: ua.progress,
      completed: true,
      completed_at: ua.completed_at
    }));
  }
  
  async getNextAchievements(userId: string, limit: number = 5): Promise<AchievementProgress[]> {
    const { data, error } = await this.supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", userId)
      .is("completed_at", null)
      .order("progress", { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return data.map(ua => ({
      achievement: ua.achievement,
      progress: ua.progress,
      completed: false,
      completed_at: null
    }));
  }
} 