import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing environment variable: SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: SUPABASE_ANON_KEY")
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Create a Supabase client with the Auth context of the logged in user.
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}
