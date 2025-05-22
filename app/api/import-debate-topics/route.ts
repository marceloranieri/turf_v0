import { NextRequest, NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

// Define the CSV row schema
const TopicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  question: z.string().min(1, "Question is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check if the request has a file
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "File must be a CSV" },
        { status: 400 }
      )
    }

    // Read and parse the CSV file
    const csvText = await file.text()
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (records.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty" },
        { status: 400 }
      )
    }

    // Validate and transform the records
    const validatedRecords = records.map((record: any) => {
      const result = TopicSchema.safeParse(record)
      if (!result.success) {
        throw new Error(`Invalid record: ${JSON.stringify(record)}`)
      }
      return result.data
    })

    // Insert records into Supabase with upsert
    if (!supabaseAdmin) {
      return Response.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from("topics")
      .upsert(validatedRecords, {
        onConflict: "title",
        ignoreDuplicates: false,
      })
      .select()

    if (error) {
      console.error("Error inserting records:", error)
      return NextResponse.json(
        { error: "Failed to insert records" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Successfully imported ${data?.length || 0} topics`,
      data,
      stats: {
        total: records.length,
        imported: data?.length || 0,
        duplicates: records.length - (data?.length || 0),
      },
    })

  } catch (error) {
    console.error("Error processing CSV:", error)
    return NextResponse.json(
      { error: "Failed to process CSV file" },
      { status: 500 }
    )
  }
}

// Optional: Add GET method to check if the endpoint is working
export async function GET() {
  return NextResponse.json({
    message: "Import debate topics endpoint is working",
    instructions: "Send a POST request with a CSV file containing title, question, category, and description columns",
  })
} 