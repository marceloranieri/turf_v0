'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SidebarNav from '@/components/SidebarNav';
import { LogOut } from 'lucide-react';

const MyCirclesPage = () => {
  const [circles, setCircles] = useState([]);
  const supabase = createClient();

  const loadCircles = async () => {
    const { data } = await supabase
      .from('circle_members')
      .select('circle_id, circles(id, topic_id, topics(title, description))');

    setCircles(data || []);
  };

  const leaveCircle = async (circleId: string) => {
    await supabase
      .from('circle_members')
      .delete()
      .eq('circle_id', circleId);
    
    loadCircles();
  };

  useEffect(() => {
    loadCircles();
  }, []);

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Circles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((entry: any) => (
            <div 
              key={entry.circle_id} 
              className="bg-white shadow-lg rounded-lg p-4 relative group"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {entry.circles.topics.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {entry.circles.topics.description}
                </p>
              </div>
              <button
                onClick={() => leaveCircle(entry.circle_id)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Leave Circle"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ))}
          {circles.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">You haven't joined any circles yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCirclesPage; 