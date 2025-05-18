export const runtime = 'nodejs';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Create bookmarks table if it doesn't exist
    const { error: tableError } = await supabase.rpc('create_bookmarks_table');
    
    if (tableError) {
      // If the RPC doesn't exist, create the table directly
      const { error } = await supabase.query(`
        -- Create bookmarks table
        CREATE TABLE IF NOT EXISTS public.bookmarks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          message_id UUID NOT NULL,
          message_text TEXT NOT NULL,
          author_id UUID NOT NULL REFERENCES auth.users(id),
          author_name TEXT NOT NULL,
          author_avatar TEXT,
          topic_id UUID NOT NULL,
          topic_name TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
        CREATE INDEX IF NOT EXISTS bookmarks_topic_id_idx ON public.bookmarks(topic_id);
        CREATE INDEX IF NOT EXISTS bookmarks_expires_at_idx ON public.bookmarks(expires_at);
        
        -- Set up RLS (Row Level Security)
        ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        DO $$ 
        BEGIN
          -- Check if the policy already exists
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'bookmarks' AND policyname = 'Users can view their own bookmarks'
          ) THEN
            CREATE POLICY "Users can view their own bookmarks" 
              ON public.bookmarks FOR SELECT 
              USING (auth.uid() = user_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'bookmarks' AND policyname = 'Users can create their own bookmarks'
          ) THEN
            CREATE POLICY "Users can create their own bookmarks" 
              ON public.bookmarks FOR INSERT 
              WITH CHECK (auth.uid() = user_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'bookmarks' AND policyname = 'Users can delete their own bookmarks'
          ) THEN
            CREATE POLICY "Users can delete their own bookmarks" 
              ON public.bookmarks FOR DELETE 
              USING (auth.uid() = user_id);
          END IF;
        END $$;
      `);
      
      if (error) {
        console.error('Error creating bookmarks table:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    
    // Create trigger to auto-delete expired bookmarks
    const { error: triggerError } = await supabase.query(`
      -- Function to delete expired bookmarks
      CREATE OR REPLACE FUNCTION delete_expired_bookmarks() RETURNS TRIGGER AS $$
      BEGIN
        DELETE FROM public.bookmarks WHERE expires_at < NOW();
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create trigger if it doesn't exist
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger 
          WHERE tgname = 'trigger_delete_expired_bookmarks'
        ) THEN
          CREATE TRIGGER trigger_delete_expired_bookmarks
            AFTER INSERT OR UPDATE ON public.bookmarks
            EXECUTE FUNCTION delete_expired_bookmarks();
        END IF;
      END $$;
    `);
    
    if (triggerError) {
      console.error('Error creating trigger:', triggerError);
      return NextResponse.json({ error: triggerError.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 