import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Rate limit configuration for different routes
const rateLimitConfig = {
  // Default rate limit for all routes
  default: {
    limit: 10,
    window: '10 s',
  },
  // More strict limits for sensitive routes
  auth: {
    limit: 5,
    window: '1 m',
  },
  // Higher limits for public routes
  public: {
    limit: 30,
    window: '1 m',
  },
};

// Helper function to get rate limit config for a route
function getRateLimitConfig(path: string) {
  if (path.startsWith('/api/auth')) {
    return rateLimitConfig.auth;
  }
  if (path.startsWith('/api/public')) {
    return rateLimitConfig.public;
  }
  return rateLimitConfig.default;
}

export async function rateLimit(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const path = request.nextUrl.pathname;
  const config = getRateLimitConfig(path);

  // Create a unique identifier for the rate limit
  const identifier = `${ip}:${path}`;

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': reset.toString(),
          'Content-Type': 'application/json',
        },
      });
    }

    return response;
  } catch (error) {
    console.error('Rate limit error:', error);
    // If rate limiting fails, allow the request but log the error
    return NextResponse.next();
  }
} 