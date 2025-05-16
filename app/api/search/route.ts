import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // This would fetch real search suggestions from a database
  // For now, we'll return mock data
  const suggestions = [
    "UI design trends",
    "React hooks",
    "Mobile app design",
    "Web accessibility",
    "TypeScript tips",
    "Product management",
  ]

  return NextResponse.json({ suggestions })
}
