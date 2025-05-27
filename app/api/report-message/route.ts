import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { WebClient } from '@slack/web-api'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)
const SLACK_CHANNEL = 'C08UJD210GZ'

export async function POST(request: Request) {
  try {
    const { messageId, reportedBy, reason, comment } = await request.json()

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