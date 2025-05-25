import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST() {
  try {
    // Verify the request is from Vercel Cron
    const headersList = headers()
    const authHeader = headersList.get("authorization")

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call the existing generate-daily-topics endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/generate-daily-topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to generate daily topics: ${response.statusText}`)
    }

    const result = await response.json()

    console.log("✅ Daily topics generated successfully:", result)

    return NextResponse.json({
      success: true,
      message: "Daily topics generated successfully",
      data: result,
    })
  } catch (error) {
    console.error("❌ Error in daily topics cron job:", error)

    return NextResponse.json(
      {
        error: "Failed to generate daily topics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
