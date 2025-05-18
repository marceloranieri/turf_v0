import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { sendEmailNotification } from "@/lib/email-service"

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { userId, emailType, subject, template, data } = body

    if (!userId || !emailType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user has permission to send this email
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await sendEmailNotification({
      userId,
      emailType,
      subject,
      template,
      data
    })

    if (!success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in email send route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 