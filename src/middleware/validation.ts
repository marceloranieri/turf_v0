import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

// Validation configuration type
type ValidationConfig = {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
};

// Validation middleware
export async function validateRequest(
  request: NextRequest,
  config: ValidationConfig
): Promise<{ success: true; data: any } | { success: false; error: string }> {
  try {
    const data: any = {};

    // Validate query parameters
    if (config.query) {
      const queryParams = Object.fromEntries(request.nextUrl.searchParams);
      data.query = await config.query.parseAsync(queryParams);
    }

    // Validate request body
    if (config.body && request.method !== 'GET') {
      const body = await request.json();
      data.body = await config.body.parseAsync(body);
    }

    // Validate URL parameters
    if (config.params) {
      const params = request.nextUrl.pathname.match(/\[([^\]]+)\]/g)?.reduce((acc, param) => {
        const key = param.slice(1, -1);
        acc[key] = request.nextUrl.pathname.split('/').pop();
        return acc;
      }, {} as Record<string, string>);
      
      if (params) {
        data.params = await config.params.parseAsync(params);
      }
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
    return { success: false, error: 'Invalid request' };
  }
}

// Helper to create validated route handler
export function withValidation(
  config: ValidationConfig,
  handler: (request: NextRequest, data: any) => Promise<Response>
) {
  return async function validatedHandler(request: NextRequest) {
    const result = await validateRequest(request, config);
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return handler(request, result.data);
  };
} 