import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/auth/callback',
  '/legal/terms',
  '/legal/privacy',
  '/legal/data-deletion',
  '/legal/accept-terms',
  '/legal/terms-update',
  '/api/', // Allow API routes to handle their own auth
  '/_next/', // Next.js assets
  '/favicon.ico',
]

export async function middleware(req: NextRequest) {
  console.log('Middleware executing for path:', req.nextUrl.pathname)
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Session error:', error)
  }
  
  // Get current path
  const path = req.nextUrl.pathname
  
  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath)
  )
  
  console.log('Path:', path, 'Is public:', isPublicPath, 'Has session:', !!session)
  
  // If path is public, allow access
  if (isPublicPath) {
    // For auth callback, ensure we don't redirect
    if (path === '/auth/callback') {
      console.log('Auth callback detected, allowing access')
      return res
    }
    
    // If user is already authenticated and tries to access login/register,
    // redirect to dashboard
    if (session && (path === '/login' || path === '/register')) {
      console.log('Authenticated user accessing auth page, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return res
  }
  
  // If no session, redirect to login
  if (!session) {
    console.log('No session found, redirecting to login')
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }
  
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
