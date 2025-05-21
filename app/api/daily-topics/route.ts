import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // Add this null check before using supabaseAdmin
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not initialized. Check environment variables.' },
        { status: 500 }
      );
    }

    const today = new Date().toISOString().split("T")[0]
    const { data, error } = await supabaseAdmin
      .from("daily_topics")
      .select(`
        *,
        topic:topics(*)
      `)
      .eq("date", today)
      .order("created_at", { ascending: true })
    
    if (error) {
      console.error("Error fetching daily topics:", error)
      return NextResponse.json(
        { error: "Failed to fetch daily topics" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in daily topics API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
