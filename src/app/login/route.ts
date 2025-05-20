import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is already logged in, redirect to dashboard
  if (session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Otherwise, let the page render
  return NextResponse.next();
} 