import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Generate cache key
    const cacheKey = `user_analytics_${user.id}_${new Date().toISOString().split('T')[0]}`;
    
    // Try to get cached data
    const { data: cachedData, error: cacheError } = await supabase
      .rpc('get_cached_analytics', {
        cache_key: cacheKey,
        cache_duration_minutes: 30 // Cache user analytics for 30 minutes
      });
      
    if (cachedData && !cacheError) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
        },
      });
    }
    
    // Fetch user-specific analytics in parallel
    const [
      topicsCreated,
      topicsParticipated,
      commentsPosted,
      votesCast,
      topPerformingTopics
    ] = await Promise.all([
      // Topics created by user
      supabase
        .from("topics")
        .select("id", { count: 'exact' })
        .eq("created_by", user.id),
        
      // Topics user participated in
      supabase
        .from("participations")
        .select("topic_id", { count: 'exact' })
        .eq("user_id", user.id),
        
      // Comments posted by user
      supabase
        .from("comments")
        .select("id", { count: 'exact' })
        .eq("user_id", user.id),
        
      // Votes cast by user
      supabase
        .from("suggestion_votes")
        .select("id", { count: 'exact' })
        .eq("user_id", user.id),
        
      // User's top performing topics
      supabase
        .from("topics")
        .select(`
          id, title, category, scheduled_date, 
          status,
          participant_count:participations(count),
          comment_count:comments(count)
        `)
        .eq("created_by", user.id)
        .order("scheduled_date", { ascending: false })
        .limit(5)
    ]);
    
    // Fetch participation over time
    const { data: participationTrend } = await supabase
      .rpc('get_user_participation_trend', { 
        user_id: user.id,
        days_back: 30
      });
    
    // Prepare response data
    const responseData = {
      summary: {
        topicsCreated: topicsCreated.count || 0,
        topicsParticipated: topicsParticipated.count || 0,
        commentsPosted: commentsPosted.count || 0,
        votesCast: votesCast.count || 0
      },
      topPerformingTopics: topPerformingTopics.data || [],
      participationTrend: participationTrend || [],
      lastUpdated: new Date().toISOString()
    };
    
    // Store in cache
    await supabase.rpc('store_analytics_cache', {
      cache_key: cacheKey,
      cache_data: responseData,
      cache_duration_minutes: 30
    });
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return NextResponse.json({ error: "Failed to fetch user analytics" }, { status: 500 });
  }
} 