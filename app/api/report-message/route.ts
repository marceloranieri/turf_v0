import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { message_id, reason, notes } = await req.json()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the original message & author
  const { data: message } = await supabase
    .from("messages")
    .select("user_id")
    .eq("id", message_id)
    .single()

  if (!message) {
    return Response.json({ error: "Message not found" }, { status: 404 })
  }

  // Insert report
  const { error } = await supabase.from("reports").insert({
    message_id,
    reported_by: session.user.id,
    reported_user_id: message.user_id,
    reason,
    notes
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
} 