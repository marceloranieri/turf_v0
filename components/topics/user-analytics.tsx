import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Button } from '@components/ui/button';
import { Loader2, TrendingUp, TrendingDown, Users, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface EngagementMetric {
  metric_name: string;
  current_value: number;
  previous_value: number;
  change_percentage: number;
}

interface ParticipationTrend {
  date_day: string;
  comments_count: number;
  topics_joined: number;
}

export function UserAnalytics() {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetric[]>([]);
  const [participationTrends, setParticipationTrends] = useState<ParticipationTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAnalytics();
  }, [timeRange]);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsResponse, trendsResponse] = await Promise.all([
        fetch(`/api/topics/analytics/user/engagement?timeRange=${timeRange}`),
        fetch('/api/topics/analytics/user/trends')
      ]);

      if (!metricsResponse.ok || !trendsResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [metricsData, trendsData] = await Promise.all([
        metricsResponse.json(),
        trendsResponse.json()
      ]);

      setEngagementMetrics(metricsData);
      setParticipationTrends(trendsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatMetricValue = (value: number) => {
    return value.toLocaleString();
  };

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'Topics Created':
        return <Calendar className="h-4 w-4" />;
      case 'Topics Joined':
        return <Users className="h-4 w-4" />;
      case 'Comments Posted':
        return <MessageSquare className="h-4 w-4" />;
      case 'Votes Cast':
        return <ThumbsUp className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <Button onClick={fetchUserAnalytics} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Analytics</h2>
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementMetrics.map((metric) => (
          <Card key={metric.metric_name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.metric_name}
              </CardTitle>
              {getMetricIcon(metric.metric_name)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatMetricValue(metric.current_value)}</div>
              <div className="flex items-center text-xs mt-1">
                {metric.change_percentage > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metric.change_percentage > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(metric.change_percentage)}% from previous period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participation Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={participationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date_day"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                  formatter={(value: number) => [value, 'Count']}
                />
                <Line
                  type="monotone"
                  dataKey="comments_count"
                  stroke="#8884d8"
                  name="Comments"
                />
                <Line
                  type="monotone"
                  dataKey="topics_joined"
                  stroke="#82ca9d"
                  name="Topics Joined"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 