import { NextResponse } from 'next/server'

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!SLACK_WEBHOOK_URL) {
      throw new Error('SLACK_WEBHOOK_URL is not configured')
    }

    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to send message to Slack')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending to Slack:', error)
    return NextResponse.json(
      { error: 'Failed to send suggestion' },
      { status: 500 }
    )
  }
}
