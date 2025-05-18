'use server';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

// Send email using Resend API only
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
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user's email preferences
    const { data: preferences, error: prefError } = await supabase
      .from("email_preferences")
      .select("*")
      .eq("user_id", userId)
      .single()
    
    if (prefError) {
      console.error("Error fetching email preferences:", prefError)
      return false
    }
    
    // Check if user has opted out of this type of email
    if (!preferences[emailType]) {
      console.log(`User ${userId} has opted out of ${emailType} emails`)
      return false
    }
    
    // Get user's email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single()
    
    if (profileError || !profile?.email) {
      console.error("Error fetching user email:", profileError)
      return false
    }

    // Get email template
    const emailTemplate = getEmailTemplate(emailType, template, data)
    if (!emailTemplate) {
      console.error(`No template found for ${emailType}`)
      return false
    }

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: profile.email,
      subject: subject || emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })

    if (emailError) {
      console.error("Error sending email:", emailError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in sendEmailNotification:", error)
    return false
  }
} 