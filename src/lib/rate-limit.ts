import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting
const store = new Map<string, { count: number; reset: number }>();

// Rate limit configurations for different route types
export const rateLimitConfigs = {
  // Strict limits for authentication routes
  auth: {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many authentication attempts. Please try again later.',
  },
  // Moderate limits for authenticated routes
  authenticated: {
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
    message: 'Too many requests to protected routes. Please slow down.',
  },
  // Higher limits for public routes
  public: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Too many requests. Please slow down.',
  },
  // Default fallback configuration
  default: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Too many requests. Please try again later.',
  },
} as const;

// Clean up old entries periodically
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.reset) {
      store.delete(key);
    }
  }
}

// Run cleanup occasionally (1% chance per request)
function occasionalCleanup() {
  if (Math.random() < 0.01) {
    cleanup();
  }
}

// Helper to determine route type
function getRouteType(path: string): keyof typeof rateLimitConfigs {
  if (path.startsWith('/api/auth')) return 'auth';
  if (path.startsWith('/api/public')) return 'public';
  if (path.startsWith('/api/')) return 'authenticated';
  return 'default';
}

// Rate limit middleware
export async function rateLimit(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const path = request.nextUrl.pathname;
  const routeType = getRouteType(path);
  const config = rateLimitConfigs[routeType];
  
  // Create a unique key for this request
  const key = `${ip}:${path}`;
  const now = Date.now();
  
  // Get or create rate limit entry
  const entry = store.get(key) || { count: 0, reset: now + config.windowMs };
  
  // Reset if window has expired
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + config.windowMs;
  }
  
  // Increment count
  entry.count += 1;
  store.set(key, entry);
  
  // Clean up old entries occasionally
  occasionalCleanup();
  
  // Calculate remaining requests
  const remaining = Math.max(0, config.max - entry.count);
  
  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', config.max.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', entry.reset.toString());
  
  // Check if rate limit exceeded
  if (entry.count > config.max) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: config.message,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((entry.reset - now) / 1000).toString(),
        },
      }
    );
  }
  
  return response;
}

// Helper to create rate-limited API route handler
export function withRateLimit(handler: Function) {
  return async function rateLimitedHandler(request: NextRequest) {
    const rateLimitResponse = await rateLimit(request);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }
    return handler(request);
  };
} 