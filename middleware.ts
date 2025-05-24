import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const ignoredRoutes = [
    '/_next',
    '/favicon.ico',
    '/auth/callback',
    '/api/auth'
  ];

  if (ignoredRoutes.some(path => req.nextUrl.pathname.startsWith(path))) {
    return res;
  }

  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()

  return res
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)']
};
