import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST() {
  try {
    // Reset all topics
    const { data, error } = await supabaseAdmin
      ?.from("topics")
      .update({
        last_shown: null,
        times_shown: 0
      })
      .select()

    if (error) {
      console.error("Error resetting topics:", error)
      return NextResponse.json(
        { error: "Failed to reset topics" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Successfully reset topic rotation",
      stats: {
        topicsReset: data?.length || 0
      }
    })

  } catch (error) {
    console.error("Error resetting topic rotation:", error)
    return NextResponse.json(
      { error: "Failed to reset topic rotation" },
      { status: 500 }
    )
  }
} 