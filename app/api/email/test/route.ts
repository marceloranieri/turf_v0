'use server';

import { NextRequest, NextResponse } from 'next/server';
import { sendEmailNotification } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    const { userId, emailType = 'notification', subject, template, data } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const success = await sendEmailNotification({
      userId,
      emailType,
      subject,
      template,
      data: data || { content: 'This is a test email from the Turf API route!', link: '/' }
    });
    if (!success) {
      return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in test email API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 