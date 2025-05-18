export const runtime = 'nodejs';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { sendEmailNotification } from "@/lib/email-service"

export async function POST(req: NextRequest) {
  // This is a test endpoint requiring service role key
  const authorization = req.headers.get("authorization")
  
  if (!authorization || !authorization.startsWith("Bearer ") || 
      authorization.split(" ")[1] !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const body = await req.json()
    const { userId, emailType, subject, template, data } = body
    
    if (!userId || !emailType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Test different email types
    const success = await sendEmailNotification({
      userId,
      emailType,
      subject,
      template,
      data
    })
    
    return NextResponse.json({ 
      success,
      message: "Test email sent successfully",
      details: {
        userId,
        emailType,
        template,
        subject,
        data
      }
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
} 