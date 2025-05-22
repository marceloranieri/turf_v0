"use client";

import React from "react";

interface UserAnalyticsProps {
  userId: string;  // Define the userId prop
}

export function UserAnalytics({ userId }: UserAnalyticsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">User Analytics</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Profile Views</div>
          <div className="mt-1 text-2xl font-bold">--</div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Content Interactions</div>
          <div className="mt-1 text-2xl font-bold">--</div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Average Engagement</div>
          <div className="mt-1 text-2xl font-bold">--</div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Followers Growth</div>
          <div className="mt-1 text-2xl font-bold">--</div>
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <h4 className="mb-2 text-sm font-medium">Activity Over Time</h4>
        <div className="h-40 w-full bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Analytics data will appear here</p>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Analytics for user ID: {userId}
      </div>
    </div>
  );
} 