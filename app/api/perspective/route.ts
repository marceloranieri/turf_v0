import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import { checkPerspective } from "@/lib/perspective";
import { checkRateLimit } from "@/lib/rate-limiter";

const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY
const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze'

export async function POST(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: () => cookies(),
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit
    const { allowed, count } = await checkRateLimit({
      userId: user.id,
      endpoint: 'perspective',
      maxRequests: 5, // 5 requests per 10 seconds
      windowMs: 10_000, // 10 seconds
    });

    if (!allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
          retryAfter: 10
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + 10_000).toString()
          }
        }
      );
    }

    const { text } = await req.json()

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