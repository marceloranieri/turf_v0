'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSession } from '@/lib/auth'

export default function MyCirclesList() {
  const supabase = createClient()
  const { session } = useSession()
  const [myCircles, setMyCircles] = useState<any[]>([])

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchCircles = async () => {
      const { data, error } = await supabase
        .from('circle_members')
        .select('circle_id, circles (id, topic_id, topics (title, description))')
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Error fetching My Circles:', error)
        return
      }

      setMyCircles(data)
    }

    fetchCircles()
  }, [session])

  return (
    <aside className="w-full p-4 space-y-3">
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">My Circles</h2>
      <ul className="space-y-2">
        {myCircles.map((entry) => (
          <li key={entry.circle_id}>
            <Link
              href={`/chat/${entry.circles.topic_id}`}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              {entry.circles.topics.title}
            </Link>
          </li>
        ))}
        {myCircles.length === 0 && (
          <li className="text-sm italic text-gray-500">No circles joined yet.</li>
        )}
      </ul>
    </aside>
  )
} 