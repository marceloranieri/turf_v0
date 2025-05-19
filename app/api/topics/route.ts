import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("topics")
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true })

    if (error) {
      console.error("Error fetching topics:", error)
      return NextResponse.json(
        { error: "Failed to fetch topics" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in topics API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 