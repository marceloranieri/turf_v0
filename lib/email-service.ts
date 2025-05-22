'use server';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.EMAIL_SERVER_PASSWORD || '')

// Email templates with fun, casual tone
const templates = {
  welcome: {
    subject: "Welcome to Turf! 👋",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
              body {
                  font-family: 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background: #fff;
                  border: 1px solid #eaeaea;
                  border-radius: 8px;
              }
              .header {
                  border-bottom: 3px solid #4CAF50;
                  padding-bottom: 15px;
                  margin-bottom: 20px;
              }
              .logo {
                  max-width: 120px;
                  margin-bottom: 10px;
              }
              h2 {
                  color: #2E2E2E;
                  font-size: 24px;
                  margin-bottom: 20px;
                  font-weight: 600;
              }
              p {
                  margin-bottom: 20px;
                  font-size: 16px;
              }
              .button {
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 12px 25px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  font-size: 16px;
                  margin: 15px 0;
              }
              .footer {
                  margin-top: 30px;
                  padding-top: 15px;
                  border-top: 1px solid #eaeaea;
                  font-size: 14px;
                  color: #666;
              }
              .bold {
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://signaturehound.com/api/v1/file/ihlhlmarjelyt?v=1747444614582" alt="Turf Logo" class="logo">
              </div>
              
              <h2>Welcome to Turf! 👋</h2>
              
              <p>Hey ${data.username || 'there'}! <span style="font-size: 1.2em;"></span> Thanks for joining Turf - we're excited to have you! (And no, we're not just saying that to everyone... okay, maybe we are, but we <em>really</em> mean it for you.)</p>
              
              <p>Your account is ready to go! Time to start exploring topics, posting brilliant thoughts, and connecting with others. Or just lurk silently - we won't judge. Much. 😏</p>
              
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/topics" class="button">Start Exploring</a></p>
              
              <p>If you ever get stuck, just remember: there are no stupid questions. (Though we've seen some that come pretty close...)</p>
              
              <div class="footer">
                  <p>See you on the other side,<br><span class="bold">The Turf Team</span> <span style="font-size: 1.1em;">👋</span></p>
                  
                  <p>Having trouble? <a href="${process.env.NEXT_PUBLIC_APP_URL}/help">Contact us</a></p>
              </div>
          </div>
      </body>
      </html>
    `
  },
  notification: {
    subject: "New Notification",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
              body {
                  font-family: 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background: #fff;
                  border: 1px solid #eaeaea;
                  border-radius: 8px;
              }
              .header {
                  border-bottom: 3px solid #4CAF50;
                  padding-bottom: 15px;
                  margin-bottom: 20px;
              }
              .logo {
                  max-width: 120px;
                  margin-bottom: 10px;
              }
              h2 {
                  color: #2E2E2E;
                  font-size: 24px;
                  margin-bottom: 20px;
                  font-weight: 600;
              }
              p {
                  margin-bottom: 20px;
                  font-size: 16px;
              }
              .button {
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 12px 25px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  font-size: 16px;
                  margin: 15px 0;
              }
              .footer {
                  margin-top: 30px;
                  padding-top: 15px;
                  border-top: 1px solid #eaeaea;
                  font-size: 14px;
                  color: #666;
              }
              .bold {
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://signaturehound.com/api/v1/file/ihlhlmarjelyt?v=1747444614582" alt="Turf Logo" class="logo">
              </div>
              
              <h2>${data.subject || "Hey! You've Got a Thing! 🔔"}</h2>
              
              <p>${data.content}</p>
              
              <p>Don't worry, we wouldn't email you if it wasn't at least <em>moderately</em> important. Or if you hadn't explicitly told us to. You did tell us to, right? 🤔</p>
              
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}${data.link}" class="button">Check It Out</a></p>
              
              <div class="footer">
                  <p>Until next notification,<br><span class="bold">The Turf Team</span> <span style="font-size: 1.1em;">👋</span></p>
                  
                  <p>Too many emails? <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/email">Update your preferences</a></p>
              </div>
          </div>
      </body>
      </html>
    `
  }
}

// Get email template
function getEmailTemplate(emailType: string, template?: string, data?: Record<string, any>): { subject: string; html: (data: any) => string; text?: string } | null {
  if (template && templates[template]) {
    return templates[template]
  }
  return templates[emailType] || null
}

// Get user email from Supabase
async function getUserEmail(userId: string): Promise<string | null> {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: user, error } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()

  if (error || !user) {
    console.error('Error fetching user email:', error)
    return null
  }

  return user.email
}

// Send email notification
export async function sendEmailNotification({
  userId,
  emailType,
  subject,
  template,
  data
}: {
  userId: string
  emailType: string
  subject?: string
  template?: string
  data?: Record<string, any>
}) {
  try {
    // Get user's email
    const userEmail = await getUserEmail(userId)
    if (!userEmail) {
      console.error('No email found for user:', userId)
      return false
    }

    // Get email template
    const emailTemplate = getEmailTemplate(emailType, template, data)
    if (!emailTemplate) {
      console.error('No template found for email type:', emailType)
      return false
    }

    // Prepare email content
    const emailContent = {
      to: userEmail,
      from: process.env.EMAIL_FROM || 'team@turfyeah.com',
      subject: subject || emailTemplate.subject,
      html: emailTemplate.html(data || {}),
      text: emailTemplate.text ? emailTemplate.text(data || {}) : undefined
    }

    // Send email using SendGrid
    await sgMail.send(emailContent)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
} 