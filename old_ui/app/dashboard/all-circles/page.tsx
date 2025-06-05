'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SidebarNav from '@/components/SidebarNav';
import { Plus, Check } from 'lucide-react';

const AllCirclesPage = () => {
  const [topics, setTopics] = useState([]);
  const [joinedTopics, setJoinedTopics] = useState(new Set());
  const supabase = createClient();

  const loadTopics = async () => {
    const { data: allTopics } = await supabase
      .from('topics')
      .select('id, title, description');
    
    const { data: userCircles } = await supabase
      .from('circle_members')
      .select('circles(topic_id)');
    
  useEffect(() => {
    const loadAllTopics = async () => {
      const { data } = await supabase.from('topics').select('id, title, description');
      setTopics(data || []);
    };
    loadAllTopics();
  }, []);

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">All Circles</h2>
        <div className="space-y-4">
          {topics.map((topic: any) => (
            <div key={topic.id} className="border rounded p-4">
              <h3 className="font-semibold">{topic.title}</h3>
              <p className="text-sm text-gray-500">{topic.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllCirclesPage; 