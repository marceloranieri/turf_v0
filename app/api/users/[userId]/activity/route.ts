import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "365");
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the start date
    const startDate = startOfDay(subDays(new Date(), days));
    
    // Fetch topics created
    const { data: topicsData, error: topicsError } = await supabase
      .from("topics")
      .select("created_at")
      .eq("user_id", params.userId)
      .gte("created_at", startDate.toISOString());
      
    if (topicsError) throw topicsError;
    
    // Fetch comments made
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("created_at")
      .eq("user_id", params.userId)
      .gte("created_at", startDate.toISOString());
      
    if (commentsError) throw commentsError;
    
    // Fetch topic participations
    const { data: participationsData, error: participationsError } = await supabase
      .from("topic_participants")
      .select("created_at")
      .eq("user_id", params.userId)
      .gte("created_at", startDate.toISOString());
      
    if (participationsError) throw participationsError;
    
    // Combine all activities
    const allActivities = [
      ...(topicsData || []),
      ...(commentsData || []),
      ...(participationsData || [])
    ];
    
    // Group activities by date
    const activityByDate = allActivities.reduce((acc: { [key: string]: number }, activity) => {
      const date = format(new Date(activity.created_at), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    // Generate array of all dates in range
    const dates = Array.from({ length: days + 1 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, "yyyy-MM-dd");
    }).reverse();
    
    // Create final data array with all dates
    const data = dates.map(date => ({
      date,
      count: activityByDate[date] || 0
    }));
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
} 