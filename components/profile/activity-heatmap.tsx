"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { addDays, format, startOfWeek, subDays, isSameMonth } from "date-fns";
import { createClient } from "@/lib/supabase/client";

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  userId: string;
  days?: number;
}

export function ActivityHeatmap({ userId, days = 365 }: ActivityHeatmapProps) {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalActivities, setTotalActivities] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const [selectedDay, setSelectedDay] = useState<ActivityData | null>(null);
  
  const supabase = createClient();
  
  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/users/${userId}/activity?days=${days}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch activity data");
        }
        
        const { data } = await response.json();
        setActivityData(data || []);
        
        // Calculate statistics
        const total = data.reduce((sum: number, day: ActivityData) => sum + day.count, 0);
        const activeDaysCount = data.filter((day: ActivityData) => day.count > 0).length;
        
        setTotalActivities(total);
        setActiveDays(activeDaysCount);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivityData();
  }, [userId, days]);
  
  // Calculate max activity for color scaling
  const maxActivity = Math.max(...activityData.map(d => d.count), 1);
  
  // Generate calendar grid
  const generateCalendarGrid = () => {
    const today = new Date();
    const startDay = startOfWeek(subDays(today, days));
    const weeks = Math.ceil(days / 7) + 1;
    
    const grid = [];
    
    for (let i = 0; i < 7; i++) {
      const row = [];
      for (let j = 0; j < weeks; j++) {
        const date = addDays(startDay, j * 7 + i);
        if (date <= today) {
          const dateStr = format(date, 'yyyy-MM-dd');
          const activity = activityData.find(d => d.date === dateStr);
          row.push({
            date,
            dateStr,
            count: activity ? activity.count : 0
          });
        }
      }
      grid.push(row);
    }
    
    return grid;
  };
  
  const grid = generateCalendarGrid();
  
  // Get color based on activity level
  const getColor = (count: number) => {
    if (count === 0) return 'bg-zinc-800';
    
    const intensity = Math.min(count / maxActivity, 1);
    
    if (intensity < 0.25) return 'bg-violet-900/30';
    if (intensity < 0.5) return 'bg-violet-800/50';
    if (intensity < 0.75) return 'bg-violet-700/70';
    return 'bg-violet-600';
  };
  
  const getMonthLabels = () => {
    if (grid.length === 0 || grid[0].length === 0) return [];
    
    const months = [];
    let currentMonth = null;
    let currentMonthStart = 0;
    
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[0][j] && grid[0][j].date) {
        const month = grid[0][j].date.getMonth();
        if (month !== currentMonth) {
          if (currentMonth !== null) {
            months.push({
              month: currentMonth,
              start: currentMonthStart,
              width: j - currentMonthStart
            });
          }
          currentMonth = month;
          currentMonthStart = j;
        }
      }
    }
    
    // Add the last month
    if (currentMonth !== null) {
      months.push({
        month: currentMonth,
        start: currentMonthStart,
        width: grid[0].length - currentMonthStart
      });
    }
    
    return months;
  };
  
  const monthLabels = getMonthLabels();
  
  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="animate-pulse bg-zinc-800 h-6 w-48 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-zinc-800 h-4 w-72 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-zinc-800/30 animate-pulse rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Activity Calendar</CardTitle>
          <CardDescription>Error loading activity data</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Activity Calendar</CardTitle>
            <CardDescription>
              Your activity over the past {days} days
            </CardDescription>
          </div>
          <div className="text-sm text-zinc-400">
            <div>{totalActivities} total activities</div>
            <div>{activeDays} active days</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedDay && (
          <div className="mb-4 p-3 bg-zinc-800 rounded-md">
            <h3 className="font-medium">{format(new Date(selectedDay.date), 'MMMM d, yyyy')}</h3>
            <p className="text-zinc-400 text-sm">
              {selectedDay.count} {selectedDay.count === 1 ? 'activity' : 'activities'}
            </p>
          </div>
        )}
        
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[800px]">
            <div className="flex text-xs text-zinc-500 mb-1 pl-8">
              {monthLabels.map((month, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 text-center"
                  style={{ width: `${month.width * 18}px` }}
                >
                  {format(new Date(new Date().getFullYear(), month.month, 1), 'MMM')}
                </div>
              ))}
            </div>
            <div className="flex">
              <div className="flex flex-col pr-2 text-xs text-zinc-500">
                <div className="h-4"></div>
                <div className="h-4">Mon</div>
                <div className="h-4"></div>
                <div className="h-4">Wed</div>
                <div className="h-4"></div>
                <div className="h-4">Fri</div>
                <div className="h-4"></div>
              </div>
              <div>
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, cellIndex) => (
                      <TooltipProvider key={cellIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`w-4 h-4 m-[1px] rounded-sm ${getColor(cell.count)} hover:ring-1 hover:ring-white cursor-pointer transition-all`}
                              onClick={() => setSelectedDay({
                                date: cell.dateStr,
                                count: cell.count
                              })}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <div>{format(cell.date, 'MMMM d, yyyy')}</div>
                              <div>{cell.count} {cell.count === 1 ? 'activity' : 'activities'}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end items-center mt-4 text-xs text-zinc-500">
              <span className="mr-2">Less</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-zinc-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-violet-900/30 rounded-sm ml-1"></div>
                <div className="w-3 h-3 bg-violet-800/50 rounded-sm ml-1"></div>
                <div className="w-3 h-3 bg-violet-700/70 rounded-sm ml-1"></div>
                <div className="w-3 h-3 bg-violet-600 rounded-sm ml-1"></div>
              </div>
              <span className="ml-2">More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 