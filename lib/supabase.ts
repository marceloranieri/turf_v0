import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Create a supabase client with the service role key for server-side operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Types for our database tables
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      topics: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          created_by: string
          category: string
          status: 'active' | 'closed' | 'archived'
          views: number
          votes: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          created_by: string
          category: string
          status?: 'active' | 'closed' | 'archived'
          views?: number
          votes?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          created_by?: string
          category?: string
          status?: 'active' | 'closed' | 'archived'
          views?: number
          votes?: number
        }
      }
      arguments: {
        Row: {
          id: string
          created_at: string
          topic_id: string
          user_id: string
          content: string
          position: 'for' | 'against'
          votes: number
        }
        Insert: {
          id?: string
          created_at?: string
          topic_id: string
          user_id: string
          content: string
          position: 'for' | 'against'
          votes?: number
        }
        Update: {
          id?: string
          created_at?: string
          topic_id?: string
          user_id?: string
          content?: string
          position?: 'for' | 'against'
          votes?: number
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
