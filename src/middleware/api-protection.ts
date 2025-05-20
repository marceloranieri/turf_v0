import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type RouteConfig = {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  allowedMethods?: string[];
};

export async function withApiProtection(
  request: NextRequest,
  config: RouteConfig = {}
) {
  const {
    requireAuth = true,
    requireAdmin = false,
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  } = config;

  // Check allowed methods
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  // Initialize Supabase client
  const supabase = createRouteHandlerClient({ cookies });

  // Check authentication if required
  if (requireAuth) {
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin status if required
    if (requireAdmin) {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single();

      if (adminError || !adminData) {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
    }

    // Return the session for use in the route handler
    return { session };
  }

  // If no auth required, return null session
  return { session: null };
}

// Helper function to create protected route handlers
export function createProtectedRouteHandler(
  handler: (request: NextRequest, context: { session: any }) => Promise<NextResponse>,
  config: RouteConfig = {}
) {
  return async (request: NextRequest) => {
    try {
      const result = await withApiProtection(request, config);
      
      // If result is a NextResponse, it means there was an error
      if (result instanceof NextResponse) {
        return result;
      }

      // Call the handler with the session
      return await handler(request, { session: result.session });
    } catch (error) {
      console.error('API route error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Example usage:
/*
import { createProtectedRouteHandler } from '@/middleware/api-protection';

// Protected route that requires authentication
export const GET = createProtectedRouteHandler(
  async (request, { session }) => {
    // Your route handler logic here
    return NextResponse.json({ data: 'Protected data' });
  },
  { requireAuth: true }
);

// Admin-only route
export const POST = createProtectedRouteHandler(
  async (request, { session }) => {
    // Your admin-only route handler logic here
    return NextResponse.json({ data: 'Admin data' });
  },
  { requireAuth: true, requireAdmin: true }
);

// Public route
export const GET = createProtectedRouteHandler(
  async (request) => {
    // Your public route handler logic here
    return NextResponse.json({ data: 'Public data' });
  },
  { requireAuth: false }
);
*/ 