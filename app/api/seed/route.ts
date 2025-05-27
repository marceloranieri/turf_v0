import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export async function POST(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: () => cookies(),
      }
    );

    // Seed topics
    const topics = [
      {
        title: "Gaming",
        question: "What's your most memorable gaming experience?",
        category: "entertainment",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Movies",
        question: "Which film deserved an Oscar but didn't get one?",
        category: "entertainment",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Food & Cooking",
        question: "What's your go-to weeknight dinner recipe?",
        category: "lifestyle",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Technology",
        question: "How is AI changing your daily work?",
        category: "tech",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Books",
        question: "What book changed your perspective on life?",
        category: "entertainment",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Travel",
        question: "What's your most underrated travel destination?",
        category: "lifestyle",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Music",
        question: "Which artist deserves more recognition?",
        category: "entertainment",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Fitness",
        question: "What's your workout routine?",
        category: "lifestyle",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const { data: topicsData, error: topicsError } = await supabase
      .from("topics")
      .upsert(topics, { onConflict: "title" })
      .select()

    if (topicsError) {
      throw topicsError
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        topics: topicsData,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}
