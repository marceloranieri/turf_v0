import { sendEmail } from "./email"

export async function sendWelcomeEmail(email: string, username: string) {
  return await sendEmail({
    to: email,
    subject: "Welcome to Turf!",
    template: "welcome",
    data: {
      username,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  })
}
