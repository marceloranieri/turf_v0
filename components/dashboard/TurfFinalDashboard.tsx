"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Circle {
  circle_id: string;
  circles: {
    id: string;
    topic_id: string;
    created_at: string;
    topics: {
      title: string;
      question: string;
      description: string;
    };
  };
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  upvotes: number;
  media_url?: string;
  media_type?: string;
}

interface TurfFinalDashboardProps {
  circles: Circle[];
  messagesByCircle: Record<string, Message[]>;
}

export function TurfFinalDashboard({ circles, messagesByCircle }: TurfFinalDashboardProps) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Your Circles</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circles.map((circle) => (
          <Card key={circle.circle_id} className="p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{circle.circles.topics.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {circle.circles.topics.description}
                </p>
              </div>

              <div className="space-y-3">
                {messagesByCircle[circle.circle_id]?.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${message.user_id}`} />
                        <AvatarFallback>
                          {message.user_id.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            User {message.user_id.slice(0, 6)}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-sm">{message.content}</p>
                        
                        {message.media_url && (
                          <div className="mt-2">
                            {message.media_type?.startsWith('image/') ? (
                              <img
                                src={message.media_url}
                                alt="Message media"
                                className="rounded-lg max-h-48 object-cover"
                              />
                            ) : message.media_type?.startsWith('video/') ? (
                              <video
                                src={message.media_url}
                                controls
                                className="rounded-lg max-h-48"
                              />
                            ) : null}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>↑ {message.upvotes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 