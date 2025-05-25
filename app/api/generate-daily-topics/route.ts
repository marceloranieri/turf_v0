import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.TURF_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Check if topics already exist for today
    const today = new Date().toISOString().split('T')[0]
    const { data: existingTopics, error: checkError } = await supabase
      .from('daily_topics')
      .select('*')
      .eq('date', today)

    if (checkError) {
      console.error('Error checking existing topics:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing topics' },
        { status: 500 }
      )
    }

    if (existingTopics && existingTopics.length > 0) {
      console.log('Topics already generated for today:', today)
      return NextResponse.json(
        { message: 'Topics already generated for today', data: existingTopics },
        { status: 200 }
      )
    }

    // Get all topics that haven't been used recently
    const { data: topics, error } = await supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !topics) {
      console.error('Error fetching topics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch topics' },
        { status: 500 }
      )
    }

    if (topics.length < 5) {
      console.error('Not enough topics available:', topics.length)
      return NextResponse.json(
        { error: 'Not enough topics available' },
        { status: 400 }
      )
    }

    const shuffled = topics.sort(() => 0.5 - Math.random())
    const todayTopics = shuffled.slice(0, 5)

    const inserts = todayTopics.map((topic) => ({
      topic_id: topic.id,
      topic_text: topic.title,
      date: today,
    }))

    const { error: insertError } = await supabase
      .from('daily_topics')
      .insert(inserts)

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to insert daily topics' },
        { status: 500 }
      )
    }

    console.log('Successfully generated daily topics:', {
      date: today,
      count: todayTopics.length,
      topics: todayTopics.map(t => t.title)
    })

    return NextResponse.json(
      { message: 'Daily topics created', data: todayTopics },
      { status: 200 }
    )

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    )
  }
}

