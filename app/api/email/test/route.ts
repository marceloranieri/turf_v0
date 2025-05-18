'use server';

import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html } = await req.json();

    sgMail.setApiKey(process.env.EMAIL_SERVER_PASSWORD || '');
    
    const message = {
      to,
      from: process.env.EMAIL_FROM || 'team@turfyeah.com',
      subject,
      text,
      html,
    };
    
    await sgMail.send(message);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 