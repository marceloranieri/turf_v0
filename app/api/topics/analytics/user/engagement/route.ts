import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const timeRangeSchema = z.enum(['weekly', 'monthly', 'quarterly']);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'monthly';

    // Validate time range
    const validatedTimeRange = timeRangeSchema.parse(timeRange);

    // Get authenticated user
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get engagement metrics
    const { data: metrics, error: metricsError } = await supabase
      .rpc('get_user_engagement_metrics', {
        user_id: user.id,
        time_range: validatedTimeRange
      });

    if (metricsError) {
      console.error('Error fetching user engagement metrics:', metricsError);
      return NextResponse.json(
        { error: 'Failed to fetch engagement metrics' },
        { status: 500 }
      );
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error in user engagement metrics endpoint:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid time range parameter' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 