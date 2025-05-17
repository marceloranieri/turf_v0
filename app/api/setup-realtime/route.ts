<<<<<<< HEAD
nano app/api/setup-community/route.ts

=======
>>>>>>> f064556771d0c1486da29dcd0ee9111471e9d510
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

<<<<<<< HEAD
    // Commented out authentication check temporarily
    /*
=======
    // Only check if user is authenticated, not if they're admin
>>>>>>> f064556771d0c1486da29dcd0ee9111471e9d510
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
<<<<<<< HEAD
    */

    // Rest of the code...
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
=======

    // Create typing_indicators table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS typing_indicators (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          topic_id UUID NOT NULL,
          is_typing BOOLEAN NOT NULL DEFAULT false,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(user_id, topic_id)
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_typing_indicators_topic_id ON typing_indicators(topic_id);
        CREATE INDEX IF NOT EXISTS idx_typing_indicators_user_id ON typing_indicators(user_id);
      `,
    })

    // Create notifications table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          topic_id UUID,
          message_id UUID,
          type VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          is_read BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
        CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
      `,
    })

    // Create messages table if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          topic_id UUID NOT NULL,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_messages_topic_id ON messages(topic_id);
        CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
        CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
      `,
    })

    // Create topics table if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS topics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT,
          created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_topics_created_by ON topics(created_by);
        CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at);
      `,
    })

    // Create profiles table if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          username TEXT UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          is_admin BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
      `,
    })

    // Enable real-time for messages table
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable row level security
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for messages
        DROP POLICY IF EXISTS "Allow public read access to messages" ON messages;
        CREATE POLICY "Allow public read access to messages" 
          ON messages FOR SELECT 
          USING (true);
          
        DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON messages;
        CREATE POLICY "Allow authenticated users to insert messages" 
          ON messages FOR INSERT 
          TO authenticated 
          WITH CHECK (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Allow users to update their own messages" ON messages;
        CREATE POLICY "Allow users to update their own messages" 
          ON messages FOR UPDATE 
          TO authenticated 
          USING (auth.uid() = user_id);
        
        -- Enable real-time
        BEGIN;
          -- Check if supabase_realtime publication exists
          IF NOT EXISTS (
            SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
          ) THEN
            CREATE PUBLICATION supabase_realtime;
          END IF;
          
          -- Add table to publication if not already added
          IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'messages'
          ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE messages;
          END IF;
        COMMIT;
      `,
    })

    // Enable real-time for typing_indicators table
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable row level security
        ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for typing_indicators
        DROP POLICY IF EXISTS "Allow public read access to typing_indicators" ON typing_indicators;
        CREATE POLICY "Allow public read access to typing_indicators" 
          ON typing_indicators FOR SELECT 
          USING (true);
          
        DROP POLICY IF EXISTS "Allow authenticated users to insert typing_indicators" ON typing_indicators;
        CREATE POLICY "Allow authenticated users to insert typing_indicators" 
          ON typing_indicators FOR INSERT 
          TO authenticated 
          WITH CHECK (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Allow users to update their own typing_indicators" ON typing_indicators;
        CREATE POLICY "Allow users to update their own typing_indicators" 
          ON typing_indicators FOR UPDATE 
          TO authenticated 
          USING (auth.uid() = user_id);
        
        -- Enable real-time
        BEGIN;
          -- Check if supabase_realtime publication exists
          IF NOT EXISTS (
            SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
          ) THEN
            CREATE PUBLICATION supabase_realtime;
          END IF;
          
          -- Add table to publication if not already added
          IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'typing_indicators'
          ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE typing_indicators;
          END IF;
        COMMIT;
      `,
    })

    // Enable real-time for notifications table
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable row level security
        ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for notifications
        DROP POLICY IF EXISTS "Allow users to read their own notifications" ON notifications;
        CREATE POLICY "Allow users to read their own notifications" 
          ON notifications FOR SELECT 
          TO authenticated 
          USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Allow authenticated users to insert notifications" ON notifications;
        CREATE POLICY "Allow authenticated users to insert notifications" 
          ON notifications FOR INSERT 
          TO authenticated 
          WITH CHECK (true);
          
        DROP POLICY IF EXISTS "Allow users to update their own notifications" ON notifications;
        CREATE POLICY "Allow users to update their own notifications" 
          ON notifications FOR UPDATE 
          TO authenticated 
          USING (auth.uid() = user_id);
        
        -- Enable real-time
        BEGIN;
          -- Check if supabase_realtime publication exists
          IF NOT EXISTS (
            SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
          ) THEN
            CREATE PUBLICATION supabase_realtime;
          END IF;
          
          -- Add table to publication if not already added
          IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'notifications'
          ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
          END IF;
        COMMIT;
      `,
    })

    // Create function to update typing status
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE OR REPLACE FUNCTION update_typing_status(
          p_user_id UUID,
          p_topic_id UUID,
          p_is_typing BOOLEAN
        )
        RETURNS VOID AS $$
        BEGIN
          INSERT INTO typing_indicators (user_id, topic_id, is_typing, last_updated)
          VALUES (p_user_id, p_topic_id, p_is_typing, now())
          ON CONFLICT (user_id, topic_id) 
          DO UPDATE SET 
            is_typing = p_is_typing,
            last_updated = now();
        END;
        $$ LANGUAGE plpgsql;
      `,
    })

    // Create function to create notification
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE OR REPLACE FUNCTION create_notification(
          p_user_id UUID,
          p_sender_id UUID,
          p_topic_id UUID,
          p_message_id UUID,
          p_type VARCHAR(50),
          p_content TEXT
        )
        RETURNS UUID AS $$
        DECLARE
          notification_id UUID;
        BEGIN
          INSERT INTO notifications (
            user_id, 
            sender_id, 
            topic_id, 
            message_id, 
            type, 
            content
          )
          VALUES (
            p_user_id, 
            p_sender_id, 
            p_topic_id, 
            p_message_id, 
            p_type, 
            p_content
          )
          RETURNING id INTO notification_id;
          
          RETURN notification_id;
        END;
        $$ LANGUAGE plpgsql;
      `,
    })

    // Set current user as admin
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Insert or update the current user as admin
        INSERT INTO profiles (id, username, full_name, is_admin)
        VALUES ('${user.id}', 'admin', 'Admin User', true)
        ON CONFLICT (id) 
        DO UPDATE SET 
          is_admin = true,
          updated_at = now();
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Real-time functionality set up successfully. You are now an admin.",
    })
  } catch (error) {
    console.error("Error setting up real-time:", error)
    return NextResponse.json(
      {
        error: "Failed to set up real-time",
        details: error,
      },
      { status: 500 },
    )
  }
}

// Also allow GET requests for easier testing in the browser
export async function GET() {
  return NextResponse.json({
    message: "Use POST to set up real-time functionality",
  })
}
>>>>>>> f064556771d0c1486da29dcd0ee9111471e9d510
