"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TopMessageCard } from "./top-message-card";

interface Circle {
  id: string;
  topic_id: string;
  created_at: string;
  topics: {
    title: string;
    question: string;
    description: string;
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
  joinedCircles: Circle[];
  unjoinedCircles: Circle[];
  messagesByCircle: Record<string, Message[]>;
  selectedTab: string;
  onTabChange: (tab: string) => void;
  visibleCircles: Circle[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function TurfFinalDashboard({
  joinedCircles,
  unjoinedCircles,
  messagesByCircle,
  selectedTab,
  onTabChange,
  visibleCircles,
  searchTerm,
  onSearchChange,
}: TurfFinalDashboardProps) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Your Circles</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search circles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full sm:w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="my">My Circles</TabsTrigger>
              <TabsTrigger value="all">All Circles</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCircles.map((circle) => (
          <Card key={circle.id} className="p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{circle.topics.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {circle.topics.description}
                </p>
              </div>

              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {messagesByCircle[circle.id]?.map((message) => (
                    <TopMessageCard key={message.id} message={message} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 