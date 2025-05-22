import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that don't require authentication
const publicPaths = [
  '/login',
  '/login-simple', // Simplified login page
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
  '/test-basic', // Test page
  '/env-debug', // Environment debug page
]

export async function middleware(req: NextRequest) {
  try {
    console.log('Middleware executing for path:', req.nextUrl.pathname)
    
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing required Supabase environment variables')
      // For test pages, allow access even without env vars
      if (req.nextUrl.pathname.startsWith('/test-basic') || 
          req.nextUrl.pathname.startsWith('/env-debug') ||
          req.nextUrl.pathname.startsWith('/login-simple')) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/env-debug', req.url))
    }
    
    const res = NextResponse.next()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => req.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove: (name, options) => {
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )
    
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session error:', error)
      // For test pages, allow access even with session errors
      if (req.nextUrl.pathname.startsWith('/test-basic') || 
          req.nextUrl.pathname.startsWith('/env-debug') ||
          req.nextUrl.pathname.startsWith('/login-simple')) {
        return res
      }
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
  } catch (error) {
    console.error('Middleware error:', error)
    // For test pages, allow access even with errors
    if (req.nextUrl.pathname.startsWith('/test-basic') || 
        req.nextUrl.pathname.startsWith('/env-debug') ||
        req.nextUrl.pathname.startsWith('/login-simple')) {
      return NextResponse.next()
    }
    // On error, redirect to error page
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
