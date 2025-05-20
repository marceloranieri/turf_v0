import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const topicSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(1),
  scheduled_date: z.string().optional(),
  duration_days: z.number().int().positive().default(7),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const tags = searchParams.get("tags") ? searchParams.get("tags")?.split(",") : []
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const offset = (page - 1) * limit

  const supabase = createClient()
  
  let query = supabase
    .from("topics")
    .select(`
      id, 
      title, 
      description, 
      category, 
      scheduled_date, 
      duration_days, 
      tags,
      participant_count:participations(count),
      comment_count:comments(count)
    `, { count: "exact" })
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }
  
  if (category) {
    query = query.eq("category", category)
  }
  
  if (tags && tags.length > 0) {
    query = query.contains("tags", tags)
  }
  
  const { data: topics, count, error } = await query
    .order("scheduled_date", { ascending: true })
    .range(offset, offset + limit - 1)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({
    topics,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    const validatedData = topicSchema.parse(body)
    
    const { data, error } = await supabase
      .from("topics")
      .insert({
        ...validatedData,
        created_by: user.id,
        status: "scheduled",
      })
      .select()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ topic: data[0] }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 })
  }
} 