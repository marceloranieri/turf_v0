import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Get authenticated user
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get participation trends
    const { data: trends, error: trendsError } = await supabase
      .rpc('get_user_participation_trend', {
        user_id: user.id,
        days_back: 30
      });

    if (trendsError) {
      console.error('Error fetching user participation trends:', trendsError);
      return NextResponse.json(
        { error: 'Failed to fetch participation trends' },
        { status: 500 }
      );
    }

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error in user participation trends endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 