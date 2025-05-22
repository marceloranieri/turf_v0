import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCSPConfig, securityHeaders, isDevelopment } from '@/lib/csp';
import { rateLimit } from '@/lib/rate-limit';
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Define CSP directives
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for Next.js development
    "https://*.supabase.co", // Supabase
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "https://fonts.googleapis.com", // Google Fonts
  ],
  imgSrc: [
    "'self'",
    "data:", // Required for Next.js
    "https://*.supabase.co", // Supabase storage
    "https://*.cloudflare.com", // Cloudflare images
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com", // Google Fonts
  ],
  connectSrc: [
    "'self'",
    "https://*.supabase.co", // Supabase
    "wss://*.supabase.co", // Supabase WebSocket
  ],
  frameSrc: ["'none'"], // No iframes allowed
  objectSrc: ["'none'"], // No objects allowed
  mediaSrc: ["'self'"],
  workerSrc: ["'self'"],
  manifestSrc: ["'self'"],
  prefetchSrc: ["'self'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"], // No embedding in iframes
  upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS
};

// Convert CSP directives to header string
function generateCSP() {
  return Object.entries(cspDirectives)
    .map(([key, value]) => {
      if (value.length === 0) return key;
      return `${key} ${value.join(' ')}`;
    })
    .join('; ');
}

// Additional security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
  ].join(', '),
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define authentication protected routes
  const protectedRoutes = ["/dashboard", "/settings", "/analytics"];
  const isProtectedRoute = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Define authentication routes
  const authRoutes = ["/login", "/signup", "/reset-password"];
  const isAuthRoute = authRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Handle API routes differently - let them handle their own auth
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  if (isApiRoute) {
    // Apply rate limiting for API routes
    const rateLimitResponse = await rateLimit(req);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }
    return res;
  }

  // Redirect if accessing protected routes without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect if accessing auth routes with active session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Handle root path
  if (req.nextUrl.pathname === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Get the response
  const response = res;

  // Add CSP header
  response.headers.set('Content-Security-Policy', getCSPConfig());

  // Add other security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add report-only mode in development
  if (isDevelopment()) {
    response.headers.set('Content-Security-Policy-Report-Only', getCSPConfig());
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public/ (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 