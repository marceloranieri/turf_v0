"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase-provider';
import { useBookmarks } from '@/components/bookmark-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function BookmarksPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { bookmarks, loading, refreshBookmarks } = useBookmarks();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [supabase, router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>
      
      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't bookmarked any messages yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={bookmark.author_avatar || undefined} />
                  <AvatarFallback>
                    {bookmark.author_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {bookmark.author_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    in {bookmark.topic_name} • {formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{bookmark.message_text}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Expires {formatDistanceToNow(new Date(bookmark.expires_at), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 