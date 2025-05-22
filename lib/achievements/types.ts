export type AchievementType = 
  | 'topic_creation'
  | 'comment_creation'
  | 'participation'
  | 'engagement'
  | 'milestone'
  | 'special';

export type AchievementTier = 
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  tier: AchievementTier;
  icon: string;
  requirement: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  achievement?: Achievement;
}

export interface UserPoints {
  user_id: string;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  completed: boolean;
  completed_at: string | null;
}

export const TIER_COLORS = {
  bronze: 'bg-amber-600',
  silver: 'bg-zinc-400',
  gold: 'bg-yellow-400',
  platinum: 'bg-blue-400',
  diamond: 'bg-violet-400'
} as const;

export const TIER_BORDER_COLORS = {
  bronze: 'border-amber-600',
  silver: 'border-zinc-400',
  gold: 'border-yellow-400',
  platinum: 'border-blue-400',
  diamond: 'border-violet-400'
} as const;

export const TIER_GRADIENTS = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-zinc-400 to-zinc-500',
  gold: 'from-yellow-400 to-yellow-500',
  platinum: 'from-blue-400 to-blue-500',
  diamond: 'from-violet-400 to-violet-500'
} as const; 