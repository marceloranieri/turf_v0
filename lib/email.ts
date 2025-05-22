import nodemailer from "nodemailer"

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Email template types
export type EmailTemplate = "welcome" | "notification" | "digest" | "password-reset"

// Function to send an email
export async function sendEmail({
  to,
  subject,
  template,
  data,
}: {
  to: string
  subject: string
  template: EmailTemplate
  data: Record<string, any>
}) {
  try {
    // Get the HTML content based on the template
    const html = await renderEmailTemplate(template, data)

    // Send the email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

// Function to render an email template
async function renderEmailTemplate(template: EmailTemplate, data: Record<string, any>) {
  // In a real app, you might use a templating engine like Handlebars or React Email
  // For simplicity, we'll use a switch statement with template literals

  switch (template) {
    case "welcome":
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Turf, ${data.username}!</h1>
          <p>Thank you for joining our community. We're excited to have you on board.</p>
          <p>Get started by exploring topics and joining conversations.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background-color: #6d28d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Start Exploring
          </a>
        </div>
      `

    case "notification":
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Notification</h2>
          <p>${data.content}</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}${data.link}" style="display: inline-block; background-color: #6d28d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            View on Turf
          </a>
        </div>
      `

    case "digest":
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Weekly Digest</h2>
          <p>Here's what you missed this week:</p>
          <ul>
            ${data.items
              .map(
                (item: any) => `
              <li style="margin-bottom: 15px;">
                <strong>${item.title}</strong>
                <p>${item.description}</p>
              </li>
            `,
              )
              .join("")}
          </ul>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background-color: #6d28d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Visit Turf
          </a>
        </div>
      `

    case "password-reset":
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to set a new password.</p>
          <a href="${data.resetLink}" style="display: inline-block; background-color: #6d28d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Reset Password
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `

    default:
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Notification from Turf</h2>
          <p>${JSON.stringify(data)}</p>
        </div>
      `
  }
}
