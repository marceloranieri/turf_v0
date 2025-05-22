"use client";

import { useState, useEffect } from "react";
import { UserAnalytics } from "@/components/topics/user-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, CalendarDays } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AnalyticsExport } from "@/components/topics/analytics-export";

interface ProfileAnalyticsTabProps {
  userId: string;
}

export function ProfileAnalyticsTab({ userId }: ProfileAnalyticsTabProps) {
  const [view, setView] = useState<"overview" | "detailed" | "engagement" | "topics">("overview");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month");
  
  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setIsLoading(true);
        
        const response = await fetch(
          `/api/topics/analytics/user?userId=${userId}&timeRange=${timeRange}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        
        const data = await response.json();
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAnalyticsData();
  }, [userId, timeRange]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Your Analytics</h2>
        
        <div className="flex items-center gap-4">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList className="bg-zinc-800/50 border-zinc-700">
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {!isLoading && analyticsData && (
            <AnalyticsExport 
              data={analyticsData.trends} 
              filename={`analytics-${timeRange}`} 
            />
          )}
        </div>
      </div>
      
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2" />
            Topic Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Summary of your activity and engagement on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserAnalytics userId={userId} showExport={false} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed" className="mt-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Participation Trends</CardTitle>
              <CardDescription>
                How your platform activity has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-violet-600 animate-spin"></div>
                </div>
              ) : error ? (
                <div className="h-[400px] flex flex-col items-center justify-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="h-[400px]">
                  <UserAnalytics userId={userId} showExport={true} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                How you engage with different topics and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-violet-600 animate-spin"></div>
                </div>
              ) : error ? (
                <div className="h-[400px] flex flex-col items-center justify-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="h-[400px]">
                  <UserAnalytics userId={userId} showExport={true} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topics" className="mt-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Topic Activity</CardTitle>
              <CardDescription>
                Your participation across different topics and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-violet-600 animate-spin"></div>
                </div>
              ) : error ? (
                <div className="h-[400px] flex flex-col items-center justify-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="h-[400px]">
                  <UserAnalytics userId={userId} showExport={true} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 