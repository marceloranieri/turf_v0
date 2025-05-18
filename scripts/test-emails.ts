import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function testEmails() {
  try {
    // Create a test user
    const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
      email: "test@example.com",
      password: "test123456",
      email_confirm: true,
      user_metadata: {
        username: "testuser"
      }
    })

    if (signUpError) throw signUpError

    if (!user) {
      throw new Error("Failed to create test user")
    }

    // Create profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        username: "testuser",
        email: "test@example.com",
        created_at: new Date().toISOString()
      })

    if (profileError) throw profileError

    // Create email preferences
    const { error: preferencesError } = await supabase
      .from("email_preferences")
      .insert({
        user_id: user.id,
        mentions: true,
        replies: true,
        new_followers: true,
        new_posts: true,
        direct_messages: true,
        marketing: true
      })

    if (preferencesError) throw preferencesError

    // Test welcome email
    console.log("Testing welcome email...")
    const welcomeResponse = await fetch("http://localhost:3000/api/test-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        userId: user.id,
        emailType: "welcome",
        template: "welcome",
        data: {
          username: "testuser"
        }
      })
    })
    console.log("Welcome email response:", await welcomeResponse.json())

    // Test notification email
    console.log("\nTesting notification email...")
    const notificationResponse = await fetch("http://localhost:3000/api/test-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        userId: user.id,
        emailType: "mentions",
        template: "notification",
        subject: "Someone mentioned you! 🎯",
        data: {
          content: "Hey @testuser, check out this awesome post!",
          link: "/topics/123"
        }
      })
    })
    console.log("Notification email response:", await notificationResponse.json())

    // Clean up test user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    if (deleteError) {
      console.error("Error cleaning up test user:", deleteError)
    }

    console.log("\nEmail testing completed!")
  } catch (error) {
    console.error("Error testing emails:", error)
  }
}

testEmails() 