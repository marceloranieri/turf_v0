import { supabase } from "./supabase"
import { sendEmail, type EmailTemplate } from "./email"

// Function to check if a user has email notifications enabled
export async function isEmailNotificationEnabled(userId: string, notificationType: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("email_preferences").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error checking email preferences:", error)
      return false
    }

    // If no preferences are set, default to true for important notifications
    if (!data) {
      return ["welcome", "password-reset", "security"].includes(notificationType)
    }

    // Check if this notification type is enabled
    return data[notificationType] === true
  } catch (error) {
    console.error("Error in isEmailNotificationEnabled:", error)
    return false
  }
}

// Function to send an email notification
export async function sendEmailNotification({
  userId,
  emailType,
  subject,
  template,
  data,
}: {
  userId: string
  emailType: string
  subject: string
  template: EmailTemplate
  data: Record<string, any>
}) {
  try {
    // Check if user has this notification type enabled
    const isEnabled = await isEmailNotificationEnabled(userId, emailType)
    if (!isEnabled) {
      return { success: false, reason: "notifications-disabled" }
    }

    // Get user's email
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single()

    if (userError || !userData?.email) {
      console.error("Error getting user email:", userError)
      return { success: false, error: userError }
    }

    // Send the email
    return await sendEmail({
      to: userData.email,
      subject,
      template,
      data,
    })
  } catch (error) {
    console.error("Error sending email notification:", error)
    return { success: false, error }
  }
}

// Function to update email preferences
export async function updateEmailPreferences(userId: string, preferences: Record<string, boolean>) {
  try {
    const { data, error } = await supabase
      .from("email_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error updating email preferences:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateEmailPreferences:", error)
    return { success: false, error }
  }
}
