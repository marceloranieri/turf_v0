"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileTabsProps {
  profile: {
    id: string;
    username: string;
  };
  isOwnProfile: boolean;
  defaultTab: string;
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

export function ProfileTabs({ profile, isOwnProfile, defaultTab, tabs }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <Tabs defaultValue={defaultTab} onValueChange={setActiveTab}>
      <TabsList className="bg-zinc-900 border-b border-zinc-800 w-full rounded-none justify-start px-2 h-auto">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={`py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className="pt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
} 