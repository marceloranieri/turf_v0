import { NextResponse } from 'next/server'

const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY
const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${PERSPECTIVE_API_URL}?key=${PERSPECTIVE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: { text },
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          IDENTITY_ATTACK: {},
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Perspective API request failed')
    }

    const data = await response.json()
    const scores = {
      toxicity: data.attributeScores.TOXICITY.summaryScore.value,
      severe_toxicity: data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      identity_attack: data.attributeScores.IDENTITY_ATTACK.summaryScore.value,
    }

    return NextResponse.json(scores)
  } catch (error: any) {
    console.error('Perspective API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    )
  }
} 