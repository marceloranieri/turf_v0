import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/auth/callback',
  '/api/', // Allow API routes to handle their own auth
  '/_next/', // Next.js assets
  '/favicon.ico',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get current path
  const path = req.nextUrl.pathname
  
  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath)
  )
  
  // If path is public, allow access
  if (isPublicPath) {
    return res
  }
  
  // If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
