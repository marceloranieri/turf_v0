'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SuggestedCircles() {
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const fetchSuggested = async () => {
      const userId = (await supabase.auth.getUser()).data.user.id;
      
      const { data: joinedCircles } = await supabase
        .from('circle_members')
        .select('circles ( topic_id )')
        .eq('user_id', userId);

      const joinedTopicIds = joinedCircles.map((c) => c.circles.topic_id);

      const { data: suggestions } = await supabase
        .from('topics')
        .select('*')
        .not('id', 'in', `(${joinedTopicIds.join(',')})`)
        .limit(3);

      setSuggested(suggestions);
    };

    fetchSuggested();
  }, []);

  const joinCircle = async (topicId: string) => {
    await supabase.from('circle_members').insert({ topic_id: topicId });
    window.location.reload();
  };

  if (suggested.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Suggested Circles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggested.map((circle) => (
          <div key={circle.id} className="bg-zinc-900 p-4 rounded-xl">
            <h3 className="text-white font-semibold">{circle.title}</h3>
            <p className="text-zinc-400 text-sm mb-4">{circle.description}</p>
            <button
              onClick={() => joinCircle(circle.id)}
              className="bg-zinc-700 px-4 py-2 rounded-full hover:bg-zinc-600 w-full"
            >
              Join Circle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 