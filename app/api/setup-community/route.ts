import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Commented out authentication check temporarily
    /*
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    */

    // Create user_interests table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS user_interests (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          interest_name VARCHAR(100) NOT NULL,
          interest_category VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(user_id, interest_name)
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_interests_category ON 
user_interests(interest_category);
      `,
    })

    // Create achievements tables
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS achievements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT NOT NULL,
          badge_image_url TEXT,
          points INTEGER NOT NULL DEFAULT 0,
          category VARCHAR(50),
          requirements JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        CREATE TABLE IF NOT EXISTS user_achievements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
          earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          progress INTEGER DEFAULT 0,
          completed BOOLEAN DEFAULT false,
          UNIQUE(user_id, achievement_id)
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON 
user_achievements(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON 
user_achievements(completed);
      `,
    })

    // Create reports table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS reports (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          reported_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          topic_id UUID,
          message_id UUID,
          reason VARCHAR(100) NOT NULL,
          details TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          admin_notes TEXT,
          reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
        CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
        CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON 
reports(reported_user_id);
      `,
    })

    // Ensure profiles table exists and add necessary columns
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Create profiles table if it doesn't exist
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          username TEXT UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          is_admin BOOLEAN DEFAULT false,
          is_banned BOOLEAN DEFAULT false,
          onboarding_completed BOOLEAN DEFAULT false,
          total_points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add columns to profiles table if they don't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'is_admin'
          ) THEN
            ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'is_banned'
          ) THEN
            ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT false;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
          ) THEN
            ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'total_points'
          ) THEN
            ALTER TABLE profiles ADD COLUMN total_points INTEGER DEFAULT 0;
          END IF;
        END $$;
      `,
    })

    // Ensure topics table exists and add necessary columns
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Create topics table if it doesn't exist
        CREATE TABLE IF NOT EXISTS topics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT,
          created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          is_featured BOOLEAN DEFAULT false,
          is_official BOOLEAN DEFAULT false,
          category VARCHAR(50),
          tags TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add columns to topics table if they don't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'topics' AND column_name = 'is_featured'
          ) THEN
            ALTER TABLE topics ADD COLUMN is_featured BOOLEAN DEFAULT false;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'topics' AND column_name = 'is_official'
          ) THEN
            ALTER TABLE topics ADD COLUMN is_official BOOLEAN DEFAULT false;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'topics' AND column_name = 'category'
          ) THEN
            ALTER TABLE topics ADD COLUMN category VARCHAR(50);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'topics' AND column_name = 'tags'
          ) THEN
            ALTER TABLE topics ADD COLUMN tags TEXT[];
          END IF;
        END $$;
      `,
    })

    // Set up RLS policies for user_interests
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable row level security
        ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for user_interests
        DROP POLICY IF EXISTS "Allow users to read their own interests" ON 
user_interests;
        CREATE POLICY "Allow users to read their own interests" 
          ON user_interests FOR SELECT 
          TO authenticated 
          USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Allow authenticated users to insert their own interests" 
ON user_interests;
        CREATE POLICY "Allow authenticated users to insert their own interests" 
          ON user_interests FOR INSERT 
          TO authenticated 
          WITH CHECK (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Allow users to update their own interests" ON 
user_interests;
        CREATE POLICY "Allow users to update their own interests" 
          ON user_interests FOR UPDATE 
          TO authenticated 
          USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Allow users to delete their own interests" ON 
user_interests;
        CREATE POLICY "Allow users to delete their own interests" 
          ON user_interests FOR DELETE 
          TO authenticated 
          USING (auth.uid() = user_id);
      `,
    })

    // Set up RLS policies for achievements
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable row level security
        ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for achievements
        DROP POLICY IF EXISTS "Allow public read access to achievements" ON achievements;
        CREATE POLICY "Allow public read access to achievements" 
          ON achievements FOR SELECT 
          USING (true);
          
        DROP POLICY IF EXISTS "Allow authenticated users to insert achievements" ON 
achievements;
        CREATE POLICY "Allow authenticated users to insert achievements" 
          ON achievements FOR INSERT 
          TO authenticated 
          WITH CHECK (true);
          
        DROP POLICY IF EXISTS "Allow authenticated users to update achievements" ON 
achievements;
        CREATE POLICY "Allow authenticated users to update achievements" 
          ON achievements FOR UPDATE 
          TO authenticated 
          USING (true);
      `,
    })

    // Set up RLS policies for user_achievements
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable row level security
        ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for user_achievements
        DROP POLICY IF EXISTS "Allow users to read their own achievements" ON 
user_achievements;
        CREATE POLICY "Allow users to read their own achievements" 
          ON user_achievements FOR SELECT 
          TO authenticated 
          USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Allow system to insert user achievements" ON 
user_achievements;
        CREATE POLICY "Allow system to insert user achievements" 
          ON user_achievements FOR INSERT 
          TO authenticated 
          WITH CHECK (true);
          
        DROP POLICY IF EXISTS "Allow system to update user achievements" ON 
user_achievements;
        CREATE POLICY "Allow system to update user achievements" 
          ON user_achievements FOR UPDATE 
          TO authenticated 
          USING (true);
      `,
    })

    // Set up RLS policies for reports
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable row level security
        ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for reports
        DROP POLICY IF EXISTS "Allow users to read their own reports" ON reports;
        CREATE POLICY "Allow users to read their own reports" 
          ON reports FOR SELECT 
          TO authenticated 
          USING (auth.uid() = reporter_id);
          
        DROP POLICY IF EXISTS "Allow authenticated users to read all reports" ON reports;
        CREATE POLICY "Allow authenticated users to read all reports" 
          ON reports FOR SELECT 
          TO authenticated 
          USING (true);
          
        DROP POLICY IF EXISTS "Allow authenticated users to insert reports" ON reports;
        CREATE POLICY "Allow authenticated users to insert reports" 
          ON reports FOR INSERT 
          TO authenticated 
          WITH CHECK (auth.uid() = reporter_id);
          
        DROP POLICY IF EXISTS "Allow authenticated users to update reports" ON reports;
        CREATE POLICY "Allow authenticated users to update reports" 
          ON reports FOR UPDATE 
          TO authenticated 
          USING (true);
      `,
    })

    // Insert default achievements
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Insert default achievements if they don't exist
        INSERT INTO achievements (name, description, badge_image_url, points, category, 
requirements)
        VALUES 
          ('Welcome Aboard', 'Complete the onboarding process', '/badges/welcome.svg', 
10, 'onboarding', '{"type": "onboarding", "completed": true}'),
          ('First Post', 'Create your first topic', '/badges/first-post.svg', 20, 
'engagement', '{"type": "topic_count", "count": 1}'),
          ('Conversation Starter', 'Get 5 replies on your topics', 
'/badges/conversation.svg', 30, 'engagement', '{"type": "replies_received", "count": 
5}'),
          ('Regular', 'Visit the app for 7 consecutive days', '/badges/regular.svg', 50, 
'loyalty', '{"type": "consecutive_days", "count": 7}'),
          ('Explorer', 'Visit 10 different topics', '/badges/explorer.svg', 40, 
'exploration', '{"type": "topics_visited", "count": 10}')
        ON CONFLICT (name) DO NOTHING;
      `,
    })

    // Create function to award achievement
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE OR REPLACE FUNCTION award_achievement(
          p_user_id UUID,
          p_achievement_name VARCHAR(100),
          p_progress INTEGER DEFAULT NULL
        )
        RETURNS BOOLEAN AS $$
        DECLARE
          v_achievement_id UUID;
          v_current_progress INTEGER;
          v_points INTEGER;
          v_completed BOOLEAN;
        BEGIN
          -- Get achievement ID
          SELECT id, points INTO v_achievement_id, v_points
          FROM achievements
          WHERE name = p_achievement_name;
          
          IF v_achievement_id IS NULL THEN
            RETURN false;
          END IF;
          
          -- Check if user already has this achievement
          SELECT progress, completed INTO v_current_progress, v_completed
          FROM user_achievements
          WHERE user_id = p_user_id AND achievement_id = v_achievement_id;
          
          IF v_completed THEN
            -- Already completed
            RETURN false;
          END IF;
          
          IF v_current_progress IS NULL THEN
            -- First time progress
            INSERT INTO user_achievements (
              user_id, 
              achievement_id, 
              progress, 
              completed
            )
            VALUES (
              p_user_id, 
              v_achievement_id, 
              COALESCE(p_progress, 1),
              COALESCE(p_progress, 1) >= 100
            );
            
            -- Update points if completed
            IF COALESCE(p_progress, 1) >= 100 THEN
              UPDATE profiles
              SET total_points = total_points + v_points
              WHERE id = p_user_id;
              
              -- Create notification if the function exists
              BEGIN
                PERFORM create_notification(
                  p_user_id,
                  NULL,
                  NULL,
                  NULL,
                  'achievement',
                  'You earned the ' || p_achievement_name || ' achievement!'
                );
              EXCEPTION WHEN OTHERS THEN
                -- Function might not exist yet, ignore error
              END;
            END IF;
          ELSE
            -- Update progress
            UPDATE user_achievements
            SET 
              progress = GREATEST(v_current_progress, COALESCE(p_progress, 
v_current_progress + 1)),
              completed = GREATEST(v_current_progress, COALESCE(p_progress, 
v_current_progress + 1)) >= 100,
              earned_at = CASE 
                WHEN GREATEST(v_current_progress, COALESCE(p_progress, v_current_progress 
+ 1)) >= 100 AND v_current_progress < 100 
                THEN now() 
                ELSE earned_at 
              END
            WHERE 
              user_id = p_user_id AND 
              achievement_id = v_achievement_id;
            
            -- Update points if newly completed
            IF GREATEST(v_current_progress, COALESCE(p_progress, v_current_progress + 1)) 
>= 100 AND v_current_progress < 100 THEN
              UPDATE profiles
              SET total_points = total_points + v_points
              WHERE id = p_user_id;
              
              -- Create notification if the function exists
              BEGIN
                PERFORM create_notification(
                  p_user_id,
                  NULL,
                  NULL,
                  NULL,
                  'achievement',
                  'You earned the ' || p_achievement_name || ' achievement!'
                );
              EXCEPTION WHEN OTHERS THEN
                -- Function might not exist yet, ignore error
              END;
            END IF;
          END IF;
          
          RETURN true;
        END;
        $$ LANGUAGE plpgsql;
      `,
    })

    // Create function to report content
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE OR REPLACE FUNCTION report_content(
          p_reporter_id UUID,
          p_reported_user_id UUID DEFAULT NULL,
          p_topic_id UUID DEFAULT NULL,
          p_message_id UUID DEFAULT NULL,
          p_reason VARCHAR(100),
          p_details TEXT DEFAULT NULL
        )
        RETURNS UUID AS $$
        DECLARE
          report_id UUID;
        BEGIN
          INSERT INTO reports (
            reporter_id,
            reported_user_id,
            topic_id,
            message_id,
            reason,
            details,
            status
          )
          VALUES (
            p_reporter_id,
            p_reported_user_id,
            p_topic_id,
            p_message_id,
            p_reason,
            p_details,
            'pending'
          )
          RETURNING id INTO report_id;
          
          -- Notify admins if the notifications table exists
          BEGIN
            INSERT INTO notifications (
              user_id,
              sender_id,
              type,
              content
            )
            SELECT 
              profiles.id,
              p_reporter_id,
              'admin_alert',
              'New content report: ' || p_reason
            FROM profiles
            WHERE profiles.is_admin = true;
          EXCEPTION WHEN OTHERS THEN
            -- Table might not exist yet, ignore error
          END;
          
          RETURN report_id;
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
      message: "Community features set up successfully. You are now an admin.",
    })
  } catch (error) {
    console.error("Error setting up community features:", error)
    return NextResponse.json(
      {
        error: "Failed to set up community features",
        details: error,
      },
      { status: 500 },
    )
  }
}

// Also allow GET requests for easier testing in the browser
export async function GET() {
  return NextResponse.json({
    message: "Use POST to set up community features",
  })
}
