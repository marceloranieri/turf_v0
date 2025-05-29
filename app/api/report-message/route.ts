import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rate-limiter';

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)
const SLACK_CHANNEL = 'C08UJD210GZ'

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
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
      endpoint: 'report-message',
      maxRequests: 3, // 3 reports per minute
      windowMs: 60_000, // 1 minute
    });

    if (!allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          message: "Too many reports. Please try again later.",
          retryAfter: 60
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + 60_000).toString()
          }
        }
      );
    }

    const { messageId, reportedBy, reason, comment } = await req.json()

    // Insert report into database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        message_id: messageId,
        reported_by: reportedBy,
        reason,
        comment,
        is_valid: true, // Default to true, can be updated by admins
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (reportError) {
      throw reportError
    }

    // Get message details
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('content, user_id')
      .eq('id', messageId)
      .single()

    if (messageError) {
      throw messageError
    }

    // Get user details
    const { data: reporter, error: reporterError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', reportedBy)
      .single()

    if (reporterError) {
      throw reporterError
    }

    // Send Slack notification
    await slack.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: `🚨 New Report!
Page: circle-chatroom
User: @${reporter.username}
Message ID: ${messageId}
Reason: ${reason}
${comment ? `Comment: ${comment}` : ''}
Link: https://turfyeah.com/admin/reports`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 New Report!',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Page:*\ncircle-chatroom`
            },
            {
              type: 'mrkdwn',
              text: `*Reported by:*\n@${reporter.username}`
            },
            {
              type: 'mrkdwn',
              text: `*Message ID:*\n${messageId}`
            },
            {
              type: 'mrkdwn',
              text: `*Reason:*\n${reason}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message Content:*\n${message.content}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View in Admin Panel',
                emoji: true
              },
              url: 'https://turfyeah.com/admin/reports'
            }
          ]
        }
      ]
    })

    return NextResponse.json({ success: true, report })
  } catch (error: any) {
    console.error('Report submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}
