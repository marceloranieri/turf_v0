import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/rate-limit';
import { withValidation } from '@/middleware/validation';
import { paginationSchema } from '@/lib/validations/api';

// GET handler for listing topics
async function listTopicsHandler(request: NextRequest, data: { query: { page: number; limit: number } }) {
  const supabase = createClient();
  const { page, limit } = data.query;
  const offset = (page - 1) * limit;

  const { data: topics, error, count } = await supabase
    .from('topics')
    .select('*, profiles(username, avatar_url), categories(name)', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch topics' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.json({
    topics,
    pagination: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Apply rate limiting and validation to the handler
export const GET = withRateLimit(
  withValidation(
    { query: paginationSchema },
    listTopicsHandler
  )
); 