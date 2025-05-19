export const runtime = 'nodejs';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  console.log('Auth callback route executing')
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"
  
  console.log('Auth callback params:', { code: !!code, next })
  
  // If code is not present, redirect to login
  if (!code) {
    console.log('No code present in callback, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    console.log('Exchanging code for session')
    // Exchange the code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      throw error
    }
    
    if (!session) {
      console.error('No session returned after code exchange')
      throw new Error('No session returned')
    }
    
    console.log('Successfully exchanged code for session, redirecting to:', next)
    
    // Redirect to the intended destination or dashboard
    return NextResponse.redirect(new URL(next, request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL(`/login?error=auth_callback_error&message=${encodeURIComponent(error.message)}`, request.url)
    )
  }
}
