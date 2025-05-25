import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.TURF_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const { data: topics, error } = await 
supabase.from('topics').select('*')

    if (error || !topics) {
      console.error('Error fetching topics:', error)
      return NextResponse.json({ error: 'Failed to fetch topics' }, { 
status: 500 })
    }

    const shuffled = topics.sort(() => 0.5 - Math.random())
    const todayTopics = shuffled.slice(0, 5)

    const todayDate = new Date().toISOString().split('T')[0]
    const inserts = todayTopics.map((topic) => ({
      topic_id: topic.id,
      topic_text: topic.title,
      date: todayDate,
    }))

    const { error: insertError } = await 
supabase.from('daily_topics').insert(inserts)

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to insert daily topics' }, 
{ status: 500 })
    }

    return NextResponse.json({ message: 'Daily topics created', data: 
todayTopics }, { status: 200 })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { 
status: 500 })
  }
}
