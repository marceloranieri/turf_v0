import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the request is for a protected route
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/settings") ||
      req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/notifications") ||
      req.nextUrl.pathname.startsWith("/topics") ||
      req.nextUrl.pathname.startsWith("/search")

    // Check if the request is for an auth route
    const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")

    // If the user is not logged in and trying to access a protected route
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL("/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If the user is logged in and trying to access an auth route
    if (session && isAuthRoute) {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error with Supabase, we'll still allow the request to proceed
    // This prevents the app from completely breaking if there's an issue with auth
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
