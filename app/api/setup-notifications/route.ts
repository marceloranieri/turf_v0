export const runtime = 'nodejs';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Create notifications table if it doesn't exist
    const { error } = await supabase.query(`
      -- Create notifications table
      CREATE TABLE IF NOT EXISTS public.notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        actor_id UUID NOT NULL REFERENCES auth.users(id),
        actor_name TEXT NOT NULL,
        actor_avatar TEXT,
        type TEXT NOT NULL CHECK (type IN ('follow', 'like', 'mention', 'reply', 'repost')),
        topic_id UUID,
        topic_name TEXT,
        message_id UUID,
        message_text TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
      );
      
      -- Create indexes
      CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
      CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);
      CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at);
      
      -- Set up RLS
      ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      DO $$ 
      BEGIN
        -- Check if the policy already exists
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications'
        ) THEN
          CREATE POLICY "Users can view their own notifications" 
            ON public.notifications FOR SELECT 
            USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications'
        ) THEN
          CREATE POLICY "Users can update their own notifications" 
            ON public.notifications FOR UPDATE 
            USING (auth.uid() = user_id);
        END IF;
      END $$;
    `);
    
    if (error) {
      console.error('Error creating notifications table:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 