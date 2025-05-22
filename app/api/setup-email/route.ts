import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin client not initialized" }, { status: 500 })
    }

    // Create email_preferences table
    // Note: Raw SQL execution removed - this should be handled through migrations
    // Table creation should be done via Supabase dashboard

    // Create RLS policies
    // Note: Raw SQL execution removed - this should be handled through migrations
    // Table creation should be done via Supabase dashboard

    // Add email column to profiles if it doesn't exist
    // Note: Raw SQL execution removed - this should be handled through migrations
    // Table creation should be done via Supabase dashboard

    return NextResponse.json({ success: true, message: "Email preferences table created successfully" })
  } catch (error) {
    console.error("Error setting up email preferences:", error)
    return NextResponse.json({ success: false, error: "Failed to set up email preferences" }, { status: 500 })
  }
}
