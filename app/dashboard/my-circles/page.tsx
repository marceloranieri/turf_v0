'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MyCirclesPage() {
  const [circles, setCircles] = useState([]);

  const fetchCircles = async () => {
    const { data } = await supabase
      .from('circle_members')
      .select('id, circles ( id, topic_id, topics ( title, description ) )');

    setCircles(data);
  };

  const leaveCircle = async (id: string) => {
    await supabase.from('circle_members').delete().eq('id', id);
    fetchCircles();
  };

  useEffect(() => {
    fetchCircles();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Circles you're in</h2>
      <ul className="flex flex-col gap-3">
        {circles.map(({ id, circles }) => (
          <li key={id} className="bg-zinc-900 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold">{circles.topics.title}</p>
                <p className="text-zinc-400 text-sm">{circles.topics.description}</p>
              </div>
              <button
                onClick={() => leaveCircle(id)}
                className="bg-zinc-700 px-4 py-1 rounded-full hover:bg-zinc-600"
              >
                Leave
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 