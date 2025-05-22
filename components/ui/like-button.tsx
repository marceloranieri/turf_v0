"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface LikeButtonProps {
  commentId: string;
  initialLikeCount: number;
  size?: "sm" | "default";
}

export function LikeButton({ commentId, initialLikeCount, size = "default" }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const supabase = createClient();
  
  const handleLike = async () => {
    try {
      setIsLoading(true);
      
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", commentId);
        
        if (error) throw error;
        
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Like
        const { error } = await supabase
          .from("comment_likes")
          .insert({ comment_id: commentId });
        
        if (error) throw error;
        
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Failed to update like status");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size={size}
      className={`flex items-center gap-1.5 ${
        isLiked ? "text-red-500 hover:text-red-400" : "text-zinc-400 hover:text-zinc-300"
      }`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{likeCount}</span>
    </Button>
  );
} 