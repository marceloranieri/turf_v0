import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST() {
  try {
    // Check if topics are already selected for today
    const today = new Date().toISOString().split('T')[0]
    const { data: existingTopics, error: checkError } = await supabaseAdmin
      ?.from("daily_topics")
      .select("id")
      .eq("date", today)

    if (checkError) {
      console.error("Error checking existing topics:", checkError)
      return NextResponse.json(
        { error: "Failed to check existing topics" },
        { status: 500 }
      )
    }

    if (existingTopics && existingTopics.length > 0) {
      return NextResponse.json(
        { error: "Topics already selected for today" },
        { status: 400 }
      )
    }

    // Get all active topics with their stats
    const { data: allTopics, error: topicsError } = await supabaseAdmin
      ?.from("topics")
      .select("*")
      .eq("is_active", true)
      .order("last_shown", { ascending: true, nullsFirst: true })
      .order("times_shown", { ascending: true })

    if (topicsError) {
      console.error("Error fetching topics:", topicsError)
      return NextResponse.json(
        { error: "Failed to fetch topics" },
        { status: 500 }
      )
    }

    if (!allTopics || allTopics.length === 0) {
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
      ?.from("daily_topics")
      .insert(dailyTopics)

    if (insertError) {
      console.error("Error inserting daily topics:", insertError)
      return NextResponse.json(
        { error: "Failed to insert daily topics" },
        { status: 500 }
      )
    }

    // Update last_shown and times_shown for selected topics
    const { error: updateError } = await supabaseAdmin
      ?.from("topics")
      .update({
        last_shown: new Date().toISOString(),
        times_shown: supabaseAdmin.rpc('increment', { x: 1 })
      })
      .in("id", selectedTopics.map(t => t.id))

    if (updateError) {
      console.error("Error updating topic stats:", updateError)
      return NextResponse.json(
        { error: "Failed to update topic stats" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Successfully generated daily topics",
      data: selectedTopics,
      stats: {
        total: selectedTopics.length,
        categories: categories.length
      }
    })

  } catch (error) {
    console.error("Error generating daily topics:", error)
    return NextResponse.json(
      { error: "Failed to generate daily topics" },
      { status: 500 }
    )
  }
} 