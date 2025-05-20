"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, MessageSquare, Users, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface ProfileTopicsProps {
  userId: string;
}

export function ProfileTopics({ userId }: ProfileTopicsProps) {
  const [activeTab, setActiveTab] = useState<"created" | "participated">("created");
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalTopics, setTotalTopics] = useState(0);
  const pageSize = 6;
  
  const supabase = createClient();
  
  useEffect(() => {
    // Reset state when tab changes
    setTopics([]);
    setPage(1);
    setLoading(true);
    setError(null);
  }, [activeTab]);
  
  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        
        let query;
        
        if (activeTab === "created") {
          // Fetch topics created by the user
          query = supabase
            .from("topics")
            .select(`
              id, 
              title, 
              description, 
              category, 
              scheduled_date, 
              status,
              created_at,
              tags,
              participant_count:participations(count),
              comment_count:comments(count)
            `, { count: 'exact' })
            .eq("creator_id", userId)
            .order("created_at", { ascending: false })
            .range((page - 1) * pageSize, page * pageSize - 1);
        } else {
          // Fetch topics the user participated in
          query = supabase
            .from("participations")
            .select(`
              topic:topics(
                id, 
                title, 
                description, 
                category, 
                scheduled_date, 
                status,
                created_at,
                tags,
                participant_count:participations(count),
                comment_count:comments(count)
              )
            `, { count: 'exact' })
            .eq("user_id", userId)
            .order("joined_at", { ascending: false })
            .range((page - 1) * pageSize, page * pageSize - 1);
        }
        
        const { data, count, error } = await query;
        
        if (error) throw error;
        
        // For participated topics, we need to flatten the data
        const formattedTopics = activeTab === "participated"
          ? data.map((item: any) => item.topic)
          : data;
        
        setTopics(prev => page === 1 ? formattedTopics : [...prev, ...formattedTopics]);
        setTotalTopics(count || 0);
        setHasMore((count || 0) > page * pageSize);
      } catch (err) {
        console.error(`Error fetching ${activeTab} topics:`, err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTopics();
  }, [userId, activeTab, page, supabase]);
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "created" | "participated")}>
        <TabsList>
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="participated">Participated</TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="pt-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Topics Created</h2>
            <p className="text-zinc-400 text-sm">
              {totalTopics} topic{totalTopics !== 1 ? 's' : ''} created
            </p>
          </div>
          
          {renderTopicsList()}
        </TabsContent>
        
        <TabsContent value="participated" className="pt-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Topics Participated In</h2>
            <p className="text-zinc-400 text-sm">
              {totalTopics} topic{totalTopics !== 1 ? 's' : ''} participated in
            </p>
          </div>
          
          {renderTopicsList()}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderTopicsList() {
    if (loading && page === 1) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
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
      );
    }
    
    if (topics.length === 0 && !loading) {
      return (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-zinc-400">No topics found</p>
            {activeTab === "created" && (
              <Link href="/topics/create">
                <Button className="mt-4">Create a Topic</Button>
              </Link>
            )}
            {activeTab === "participated" && (
              <Link href="/topics">
                <Button className="mt-4">Browse Topics</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Link href={`/topics/${topic.id}`} key={topic.id}>
              <Card className="bg-zinc-900 border-zinc-800 h-full hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1">{topic.title}</CardTitle>
                    <Badge 
                      variant={topic.status === 'active' ? 'default' : 
                              topic.status === 'scheduled' ? 'secondary' : 
                              topic.status === 'completed' ? 'outline' : 'destructive'}
                      className="whitespace-nowrap"
                    >
                      {topic.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-1">
                    {topic.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {topic.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {topic.tags && topic.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {topic.tags && topic.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{topic.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-zinc-400 text-xs gap-3">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {topic.participant_count}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {topic.comment_count}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full justify-end">
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
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
    );
  }
} 