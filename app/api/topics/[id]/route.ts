import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { is_active } = body

    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        { error: "is_active must be a boolean" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("topics")
      .update({ is_active })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating topic:", error)
      return NextResponse.json(
        { error: "Failed to update topic" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in topic update API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 