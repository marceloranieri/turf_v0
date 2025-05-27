import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkToxicity } from "@/app/lib/moderation";

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export async function POST(req: Request) {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: () => cookies(),
    }
  );

  const { message, circleId } = await req.json()

  // Get current user
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check for banned users
  const { data: bannedUser } = await supabase
    .from("banned_users")
    .select("reason")
    .eq("user_id", session.user.id)
    .single()

  if (bannedUser) {
    return Response.json({ 
      error: "Your account has been banned",
      reason: bannedUser.reason 
    }, { status: 403 })
  }

  // Check message toxicity
  const isClean = await checkToxicity(message)
  if (!isClean) {
    return Response.json({ 
      error: "Message blocked due to inappropriate content" 
    }, { status: 400 })
  }

  // Insert message
  const { data, error } = await supabase
    .from("messages")
    .insert({
      text: message,
      user_id: session.user.id,
      circle_id: circleId,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data })
} 