'use client';
import Image from 'next/image';

interface Circle {
  title: string;
  description: string;
  circleId: string;
  messages: any[];
}

export default function FeedCircleColumn({ circle }: { circle: Circle }) {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-zinc-900 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2">{circle.title}</h3>
        <p className="text-zinc-400 text-sm mb-4">{circle.description}</p>
        
        <div className="space-y-3">
          {circle.messages?.map((msg) => (
            <div key={msg.id} className="bg-zinc-800 p-3 rounded-lg">
              {msg.media_url && (
                <Image
                  src={msg.media_url}
                  alt="Message media"
                  width={300}
                  height={200}
                  className="rounded-lg mb-2"
                />
              )}
              <p className="text-white text-sm">{msg.content}</p>
              <p className="text-zinc-500 text-xs mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 