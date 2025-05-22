"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { AchievementProgress, TIER_COLORS, TIER_GRADIENTS } from "@/lib/achievements/types";

interface AchievementCardProps {
  achievement: AchievementProgress;
  showProgress?: boolean;
}

export function AchievementCard({ achievement, showProgress = true }: AchievementCardProps) {
  const { tier, icon, name, description, requirement, points } = achievement.achievement;
  const progress = achievement.progress;
  const completed = achievement.completed;
  const completedAt = achievement.completed_at;
  
  const progressPercentage = Math.min((progress / requirement) * 100, 100);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className={`
              relative overflow-hidden transition-all duration-300
              ${completed ? TIER_COLORS[tier] : 'bg-zinc-800'}
              ${completed ? 'hover:scale-105' : 'hover:bg-zinc-700'}
              cursor-pointer
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-10" />
            
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                  ${completed ? 'bg-white/10' : 'bg-zinc-700'}
                `}>
                  {icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {name}
                  </h3>
                  
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                    {description}
                  </p>
                  
                  {showProgress && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-300">
                          {progress} / {requirement}
                        </span>
                        <span className="text-zinc-300">
                          {points} points
                        </span>
                      </div>
                      
                      <Progress 
                        value={progressPercentage} 
                        className="h-1.5"
                        indicatorClassName={completed ? TIER_GRADIENTS[tier] : ''}
                      />
                    </div>
                  )}
                  
                  {completed && completedAt && (
                    <p className="text-xs text-zinc-300 mt-2">
                      Completed {formatDistanceToNow(new Date(completedAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        
        <TooltipContent side="bottom" className="max-w-[300px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <div>
                <h4 className="font-semibold">{name}</h4>
                <p className="text-xs text-zinc-400">{description}</p>
              </div>
            </div>
            
            <div className="text-sm">
              <p>Progress: {progress} / {requirement}</p>
              <p>Points: {points}</p>
              {completed && completedAt && (
                <p>Completed: {formatDistanceToNow(new Date(completedAt), { addSuffix: true })}</p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 