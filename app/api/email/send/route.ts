import { NextResponse } from "next/server"
import { sendEmailNotification } from "@/lib/supabase-email"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { userId, emailType, subject, template, data } = body

    // Verify the request is authorized
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    if (token !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Send the email notification
    const result = await sendEmailNotification({
      userId,
      emailType,
      subject,
      template,
      data,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || result.reason }, { status: 400 })
    }

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error) {
    console.error("Error in email send API:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
