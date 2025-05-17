"use client"

// This is a partial update to your existing auth-context.tsx file
// Add this import at the top
import { sendWelcomeEmail } from "@/lib/welcome-email"
import { useRouter } from "next/router"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

// Update your signUp function to include sending a welcome email
const signUp = async (email: string, password: string, userData: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  setIsLoading(true)
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          username: userData.username,
        },
      },
    })

    if (error) throw error

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        username: userData.username,
        full_name: userData.fullName,
        avatar_url: null,
        email: email, // Store email in profiles table
      })

      if (profileError) throw profileError

      // Create default user settings
      const { error: settingsError } = await supabase.from("user_settings").insert({
        user_id: data.user.id,
        theme: "dark",
        notifications_enabled: true,
        direct_messages_enabled: true,
        private_profile: false,
      })

      if (settingsError) throw settingsError

      // Send welcome email
      await sendWelcomeEmail(email, userData.username)
    }

    router.push("/dashboard")
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  } finally {
    setIsLoading(false)
  }
}
