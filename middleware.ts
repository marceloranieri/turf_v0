import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Required env vars for Supabase SSR + app core
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'TURF_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'PERSPECTIVE_API_KEY',
  'SLACK_BOT_TOKEN',
  'EMAIL_SERVER_HOST',
  'EMAIL_SERVER_PORT',
  'EMAIL_SERVER_USER',
  'EMAIL_SERVER_PASSWORD',
  'EMAIL_FROM',
  'CRON_SECRET',
];

export function middleware(req: NextRequest) {
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    return new NextResponse(
      JSON.stringify({
        error: 'Missing required environment variables',
        missing: missingVars,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Everything looks good, continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|api/public).*)'],
};
