import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin client
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null;

// Verify the request is from Vercel Cron
function isValidCronRequest(request: Request) {
  const authHeader = request.headers.get("authorization")
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(request: Request) {
  console.log("Cron job: Starting daily topic generation")

  // Verify the request
  if (!isValidCronRequest(request)) {
    console.error("Cron job: Invalid request")
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    // Check if supabaseAdmin is initialized
    if (!supabaseAdmin) {
      console.error("Cron job: Supabase admin client not initialized. Check environment variables.")
      return NextResponse.json(
        { error: 'Supabase admin client not initialized. Check environment variables.' },
        { status: 500 }
      )
    }

    // Check if topics are already selected for today
    const today = new Date().toISOString().split('T')[0]
    const { data: existingTopics, error: checkError } = await supabaseAdmin
      .from("daily_topics")
      .select("id")
      .eq("date", today)

    if (checkError) {
      console.error("Cron job: Error checking existing topics:", checkError)
      return NextResponse.json({ error: 'Failed to check existing topics' }, { status: 500 })
    }

    if (existingTopics && existingTopics.length > 0) {
      console.log("Cron job: Topics already selected for today")
      return NextResponse.json({
        message: "Topics already selected for today",
        data: existingTopics
      })
    }

    // Get all active topics with their stats
    const { data: allTopics, error: topicsError } = await supabaseAdmin
      .from("topics")
      .select("*")
      .eq("is_active", true)
      .order("last_shown", { ascending: true, nullsFirst: true })
      .order("times_shown", { ascending: true })

    if (topicsError) {
      console.error("Cron job: Error fetching topics:", topicsError)
      throw topicsError
    }

    if (!allTopics || allTopics.length === 0) {
      console.log("Cron job: No active topics available")
      return NextResponse.json(
        { error: "No active topics available" },
        { status: 400 }
      )
    }

    // Group topics by category
    const topicsByCategory = allTopics.reduce((acc: { [key: string]: any[] }, topic) => {
      if (!acc[topic.category]) {
        acc[topic.category] = []
      }
      acc[topic.category].push(topic)
      return acc
    }, {})

    // Select topics (max 2 per category)
    const selectedTopics: any[] = []
    const categories = Object.keys(topicsByCategory)

    for (const category of categories) {
      const categoryTopics = topicsByCategory[category]
      const selectedFromCategory = categoryTopics
        .sort((a, b) => {
          // First prioritize never shown topics
          if (a.last_shown === null && b.last_shown !== null) return -1
          if (a.last_shown !== null && b.last_shown === null) return 1
          // Then by times shown
          return a.times_shown - b.times_shown
        })
        .slice(0, 2)

      selectedTopics.push(...selectedFromCategory)
    }

    // If we don't have enough topics, add more from any category
    if (selectedTopics.length < 10) {
      const remainingTopics = allTopics
        .filter(topic => !selectedTopics.find(t => t.id === topic.id))
        .sort((a, b) => {
          if (a.last_shown === null && b.last_shown !== null) return -1
          if (a.last_shown !== null && b.last_shown === null) return 1
          return a.times_shown - b.times_shown
        })
        .slice(0, 10 - selectedTopics.length)

      selectedTopics.push(...remainingTopics)
    }

    // Insert selected topics into daily_topics
    const dailyTopics = selectedTopics.map(topic => ({
      topic_id: topic.id,
      date: today
    }))

    const { error: insertError } = await supabaseAdmin
      .from("daily_topics")
      .insert(dailyTopics)

    if (insertError) {
      console.error("Cron job: Error inserting daily topics:", insertError)
      throw insertError
    }

    // Update last_shown and times_shown for selected topics
    const { error: updateError } = await supabaseAdmin
      .from("topics")
      .update({
        last_shown: new Date().toISOString(),
        times_shown: supabaseAdmin.rpc('increment', { x: 1 })
      })
      .in("id", selectedTopics.map(t => t.id))

    if (updateError) {
      console.error("Cron job: Error updating topic stats:", updateError)
      throw updateError
    }

    console.log("Cron job: Successfully generated daily topics")
    return NextResponse.json({
      message: "Successfully generated daily topics",
      data: selectedTopics,
      stats: {
        total: selectedTopics.length,
        categories: categories.length
      }
    })

  } catch (error) {
    console.error("Cron job: Error generating daily topics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 