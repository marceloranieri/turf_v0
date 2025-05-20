import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Loader2 } from "lucide-react";

interface AnalyticsData {
  totalTopics: number;
  totalParticipants: number;
  totalComments: number;
  topicEngagement: Array<{
    name: string;
    comments: number;
    participants: number;
    votes: number;
  }>;
  participationTrend: Array<{
    date: string;
    participants: number;
    comments: number;
  }>;
  topicCategories: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

export function TopicAnalytics() {
  const [activeTab, setActiveTab] = useState("engagement");
  const [timeRange, setTimeRange] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);
  
  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/topics/analytics?timeRange=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error || "Failed to load analytics"}</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={fetchAnalytics}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Topic Analytics Dashboard</h1>
        <select 
          className="p-2 rounded-md border"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="weekly">Last 7 days</option>
          <option value="monthly">Last 30 days</option>
          <option value="quarterly">Last 90 days</option>
          <option value="yearly">Last 12 months</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{data.totalTopics}</CardTitle>
            <CardDescription>Active Topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-500">↑ 12%</span> from last period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{data.totalParticipants}</CardTitle>
            <CardDescription>Total Participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-500">↑ 8%</span> from last period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{data.totalComments}</CardTitle>
            <CardDescription>Total Comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-500">↑ 15%</span> from last period
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="engagement">Topic Engagement</TabsTrigger>
          <TabsTrigger value="trends">Participation Trends</TabsTrigger>
          <TabsTrigger value="categories">Topic Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="engagement" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement by Topic</CardTitle>
              <CardDescription>Comments, participants, and votes across top topics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topicEngagement}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="comments" fill="#8884d8" name="Comments" />
                  <Bar dataKey="participants" fill="#82ca9d" name="Participants" />
                  <Bar dataKey="votes" fill="#ffc658" name="Votes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Participation Trends</CardTitle>
              <CardDescription>Participants and comments over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.participationTrend}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="participants" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    name="Participants" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    stroke="#82ca9d" 
                    name="Comments" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Distribution by Category</CardTitle>
              <CardDescription>Breakdown of topics by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topicCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.topicCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} topics`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 