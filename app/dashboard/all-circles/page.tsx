'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AllCirclesPage() {
  const [joined, setJoined] = useState([]);
  const [others, setOthers] = useState([]);

  const fetchAllCircles = async () => {
    const userId = (await supabase.auth.getUser()).data.user.id;

    const { data: joinedCircles } = await supabase
      .from('circle_members')
      .select('id, circles ( topic_id, topics ( title, description ) )')
      .eq('user_id', userId);

    const joinedTopicIds = joinedCircles.map((c) => c.circles.topic_id);

    const { data: allTopics } = await supabase
      .from('topics')
      .select('*')
      .not('id', 'in', `(${joinedTopicIds.join(',')})`);

    setJoined(joinedCircles);
    setOthers(allTopics);
  };

  const join = async (topicId: string) => {
    await supabase.from('circle_members').insert({ topic_id: topicId });
    fetchAllCircles();
  };

  const leave = async (id: string) => {
    await supabase.from('circle_members').delete().eq('id', id);
    fetchAllCircles();
  };

  useEffect(() => {
    fetchAllCircles();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Circles you're in</h2>
      <ul className="mb-6">
        {joined.map(({ id, circles }) => (
          <li key={id} className="mb-3">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{circles.topics.title}</p>
                <p className="text-sm text-zinc-400">{circles.topics.description}</p>
              </div>
              <button onClick={() => leave(id)}>Leave</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Other Circles</h2>
      <ul>
        {others.map((circle) => (
          <li key={circle.id} className="mb-3">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{circle.title}</p>
                <p className="text-sm text-zinc-400">{circle.description}</p>
              </div>
              <button onClick={() => join(circle.id)}>Join</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 