import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createProtectedRouteHandler } from '@/middleware/api-protection';
import { createValidatedRouteHandler } from '@/middleware/validation';
import { 
  adminCreateTopicSchema, 
  adminUpdateTopicSchema, 
  topicQuerySchema,
  idParamSchema 
} from '@/lib/validations/api';

// GET /api/admin/topics - Get all topics (admin only)
export const GET = createProtectedRouteHandler(
  createValidatedRouteHandler(
    async (request: NextRequest, { session }) => {
      const supabase = createRouteHandlerClient({ cookies });
      const { searchParams } = new URL(request.url);
      const query = Object.fromEntries(searchParams.entries());
      const { page, limit } = topicQuerySchema.parse(query);
      const offset = (page - 1) * limit;

      const { data: topics, error, count } = await supabase
        .from('topics')
        .select('*, profiles!topics_created_by_fkey(*)', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch topics' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        topics,
        pagination: {
          page,
          limit,
          total: count
        }
      });
    },
    { query: topicQuerySchema }
  ),
  { requireAuth: true, requireAdmin: true }
);

// POST /api/admin/topics - Create a new topic (admin only)
export const POST = createProtectedRouteHandler(
  createValidatedRouteHandler(
    async (request: NextRequest, { session }) => {
      const supabase = createRouteHandlerClient({ cookies });
      const body = await request.json();

      const { data: topic, error } = await supabase
        .from('topics')
        .insert({
          ...body,
          created_by: session.user.id
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Failed to create topic' },
          { status: 500 }
        );
      }

      return NextResponse.json({ topic });
    },
    { body: adminCreateTopicSchema }
  ),
  { requireAuth: true, requireAdmin: true }
);

// DELETE /api/admin/topics/[id] - Delete a topic (admin only)
export const DELETE = createProtectedRouteHandler(
  createValidatedRouteHandler(
    async (request: NextRequest, { session }) => {
      const supabase = createRouteHandlerClient({ cookies });
      const { searchParams } = new URL(request.url);
      const params = { id: searchParams.get('id') };
      const { id } = idParamSchema.parse(params);

      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to delete topic' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    },
    { params: idParamSchema }
  ),
  { requireAuth: true, requireAdmin: true }
); 