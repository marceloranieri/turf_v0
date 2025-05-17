import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  try {
    // Check if user is authenticated and has admin rights
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Add email column to profiles table if it doesn't exist
    await supabase.rpc('add_column_if_not_exists', { 
      table_name: 'profiles',
      column_name: 'email',
      column_type: 'text'
    })
    
    // Create email_preferences table
    await supabase.query(`
      CREATE TABLE IF NOT EXISTS email_preferences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        mentions BOOLEAN DEFAULT TRUE,
        replies BOOLEAN DEFAULT TRUE,
        new_followers BOOLEAN DEFAULT TRUE,
        new_posts BOOLEAN DEFAULT TRUE,
        direct_messages BOOLEAN DEFAULT TRUE,
        marketing BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(user_id)
      );
      
      -- Add RLS policies
      ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
      
      -- Allow users to view their own preferences
      DROP POLICY IF EXISTS "Users can view their own email preferences" ON email_preferences;
      CREATE POLICY "Users can view their own email preferences"
        ON email_preferences FOR SELECT
        USING (auth.uid() = user_id);
      
      -- Allow users to update their own preferences
      DROP POLICY IF EXISTS "Users can update their own email preferences" ON email_preferences;
      CREATE POLICY "Users can update their own email preferences"
        ON email_preferences FOR UPDATE
        USING (auth.uid() = user_id);
      
      -- Allow insert of own preferences
      DROP POLICY IF EXISTS "Users can insert their own email preferences" ON email_preferences;
      CREATE POLICY "Users can insert their own email preferences"
        ON email_preferences FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `)
    
    return NextResponse.json({ success: true, message: "Email notification system set up successfully" })
  } catch (error) {
    console.error("Error setting up email notification system:", error)
    return NextResponse.json({ error: "Failed to set up email notification system" }, { status: 500 })
  }
} 