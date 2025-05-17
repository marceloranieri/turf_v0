import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

// Check if user has opted in for this email type
async function checkEmailPreference(userId: string, emailType: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("email_preferences")
      .select(emailType)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error checking email preferences:", error)
      return false
    }

    return data?.[emailType] ?? false
  } catch (error) {
    console.error("Error checking email preference:", error)
    return false
  }
}

// Get user email from profiles table
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single()

    if (error || !data?.email) {
      // Fallback to auth.users
      const { data: authData, error: authError } = await supabaseAdmin
        .auth
        .admin
        .getUserById(userId)

      if (authError) {
        console.error("Error getting user email:", authError)
        return null
      }

      return authData.user?.email || null
    }

    return data.email
  } catch (error) {
    console.error("Error getting user email:", error)
    return null
  }
}

// Send email using Resend API
export async function sendEmailNotification({
  userId,
  emailType,
  subject,
  template = "notification",
  data = {}
}: {
  userId: string
  emailType: string
  subject?: string
  template?: "welcome" | "notification"
  data?: any
}) {
  try {
    // Skip if missing API key
    if (!process.env.RESEND_API_KEY) {
      console.warn("Missing RESEND_API_KEY environment variable")
      return false
    }

    // Skip if user has opted out (except for welcome emails)
    if (template !== "welcome") {
      const hasOptedIn = await checkEmailPreference(userId, emailType)
      if (!hasOptedIn) {
        return false
      }
    }

    // Get user email
    const email = await getUserEmail(userId)
    if (!email) {
      console.warn("No email found for user", userId)
      return false
    }

    // Use custom subject or default from template
    const emailSubject = subject || templates[template].subject

    // Prepare email content
    const htmlContent = templates[template].html(data)

    // Send email with Resend
    const resend = await import('resend').then(module => module.default)
    const resendClient = new resend(process.env.RESEND_API_KEY)
    
    const { data: response, error } = await resendClient.emails.send({
      from: `Turf <${process.env.RESEND_FROM_EMAIL || 'noreply@example.com'}>`,
      to: email,
      subject: emailSubject,
      html: htmlContent
    })

    if (error) {
      console.error("Error sending email:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending email notification:", error)
    return false
  }
} 