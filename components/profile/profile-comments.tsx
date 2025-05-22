"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, ArrowUpRight, CalendarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LikeButton } from "@/components/ui/like-button";

interface ProfileCommentsProps {
  userId: string;
}

export function ProfileComments({ userId }: ProfileCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "mostLiked">("newest");
  const pageSize = 10;
  
  const supabase = createClient();
  
  useEffect(() => {
    // Reset state when sort changes
    setComments([]);
    setPage(1);
    setLoading(true);
    setError(null);
  }, [sortBy]);
  
  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        
        let query = supabase
          .from("comments")
          .select(`
            id, 
            content, 
            created_at,
            topic:topics(id, title),
            likes_count:comment_likes(count)
          `, { count: 'exact' })
          .eq("user_id", userId);
        
        // Apply sorting
        if (sortBy === "newest") {
          query = query.order("created_at", { ascending: false });
        } else if (sortBy === "oldest") {
          query = query.order("created_at", { ascending: true });
        } else if (sortBy === "mostLiked") {
          // First get comment IDs ordered by like count
          const { data: commentIds } = await supabase
            .from("comment_likes")
            .select("comment_id, count")
            .eq("comment_id.user_id", userId)
            .group("comment_id")
            .order("count", { ascending: false });
          
          if (commentIds && commentIds.length > 0) {
            // Then fetch those comments in the order of most likes
            const ids = commentIds.map((item: any) => item.comment_id);
            query = query.in("id", ids);
          } else {
            // Fallback to newest if no likes found
            query = query.order("created_at", { ascending: false });
          }
        }
        
        // Apply pagination
        query = query.range((page - 1) * pageSize, page * pageSize - 1);
        
        const { data, count, error } = await query;
        
        if (error) throw error;
        
        setComments(prev => page === 1 ? data : [...prev, ...data]);
        setTotalComments(count || 0);
        setHasMore((count || 0) > page * pageSize);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchComments();
  }, [userId, sortBy, page, supabase]);
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Comments</h2>
          <p className="text-zinc-400 text-sm">
            {totalComments} comment{totalComments !== 1 ? 's' : ''} posted
          </p>
        </div>
        
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="mostLiked">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading && page === 1 ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error}</p>
            <Button 
              onClick={() => {
                setError(null);
                setPage(1);
              }} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : comments.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-400">No comments found</p>
            <Link href="/topics">
              <Button className="mt-4">Join Discussions</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Link 
                      href={`/topics/${comment.topic.id}`}
                      className="font-medium text-violet-400 hover:text-violet-300 hover:underline flex items-center"
                    >
                      {comment.topic.title}
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                    <div className="flex items-center text-zinc-400 text-xs">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <p className="text-zinc-200 whitespace-pre-line">
                    {comment.content}
                  </p>
                  
                  <div className="mt-3 text-zinc-400 text-xs flex justify-end items-center">
                    <LikeButton 
                      commentId={comment.id} 
                      initialLikeCount={comment.likes_count} 
                      size="sm" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {loading && page > 1 && (
            <div className="flex justify-center mt-6">
              <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
            </div>
          )}
          
          {hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <Button onClick={handleLoadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 