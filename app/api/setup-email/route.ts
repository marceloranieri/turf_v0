import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin client not initialized" }, { status: 500 })
    }

    // Create email_preferences table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS email_preferences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        daily_digest BOOLEAN DEFAULT true,
        new_followers BOOLEAN DEFAULT true,
        replies BOOLEAN DEFAULT true,
        mentions BOOLEAN DEFAULT true,
        topic_activity BOOLEAN DEFAULT true,
        marketing BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id)
      );
    `)

    // Create RLS policies
    await supabaseAdmin.query(`
      -- Enable RLS
      ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY "Users can view their own email preferences"
      ON email_preferences FOR SELECT
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own email preferences"
      ON email_preferences FOR UPDATE
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own email preferences"
      ON email_preferences FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    `)

    // Add email column to profiles if it doesn't exist
    await supabaseAdmin.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'profiles'
          AND column_name = 'email'
        ) THEN
          ALTER TABLE profiles ADD COLUMN email TEXT;
        END IF;
      END $$;
    `)

    return NextResponse.json({ success: true, message: "Email preferences table created successfully" })
  } catch (error) {
    console.error("Error setting up email preferences:", error)
    return NextResponse.json({ success: false, error: "Failed to set up email preferences" }, { status: 500 })
  }
}
