import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const timeRangeSchema = z.enum(["weekly", "monthly", "quarterly", "yearly"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "monthly";
    
    // Validate time range
    const validatedTimeRange = timeRangeSchema.parse(timeRange);
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (validatedTimeRange) {
      case "weekly":
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate.setDate(now.getDate() - 30);
        break;
      case "quarterly":
        startDate.setDate(now.getDate() - 90);
        break;
      case "yearly":
        startDate.setDate(now.getDate() - 365);
        break;
    }
    
    const supabase = createClient();
    
    // Get total counts
    const { data: totalTopics, error: topicsError } = await supabase
      .from("topics")
      .select("id", { count: "exact" })
      .gte("created_at", startDate.toISOString());
      
    const { data: totalParticipants, error: participantsError } = await supabase
      .from("participations")
      .select("id", { count: "exact" })
      .gte("created_at", startDate.toISOString());
      
    const { data: totalComments, error: commentsError } = await supabase
      .from("comments")
      .select("id", { count: "exact" })
      .gte("created_at", startDate.toISOString());
    
    if (topicsError || participantsError || commentsError) {
      throw new Error("Failed to fetch total counts");
    }
    
    // Get topic engagement data
    const { data: topicEngagement, error: engagementError } = await supabase
      .from("topics")
      .select(`
        id,
        title,
        comments:comments(count),
        participants:participations(count),
        votes:topic_suggestions(count)
      `)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })
      .limit(10);
      
    if (engagementError) {
      throw new Error("Failed to fetch topic engagement data");
    }
    
    // Get participation trends
    const { data: participationTrend, error: trendError } = await supabase
      .rpc("get_participation_trends", {
        start_date: startDate.toISOString(),
        end_date: now.toISOString(),
        interval: validatedTimeRange === "weekly" ? "day" : "week"
      });
      
    if (trendError) {
      throw new Error("Failed to fetch participation trends");
    }
    
    // Get topic categories
    const { data: topicCategories, error: categoriesError } = await supabase
      .from("topics")
      .select("category")
      .gte("created_at", startDate.toISOString());
      
    if (categoriesError) {
      throw new Error("Failed to fetch topic categories");
    }
    
    // Process category data
    const categoryCount = topicCategories.reduce((acc, topic) => {
      acc[topic.category] = (acc[topic.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value
    }));
    
    return NextResponse.json({
      totalTopics: totalTopics?.length || 0,
      totalParticipants: totalParticipants?.length || 0,
      totalComments: totalComments?.length || 0,
      topicEngagement: topicEngagement.map(topic => ({
        name: topic.title,
        comments: topic.comments[0].count,
        participants: topic.participants[0].count,
        votes: topic.votes[0].count
      })),
      participationTrend,
      topicCategories: categoryData
    });
    
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
} 