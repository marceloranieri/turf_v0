import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    // Create profiles table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        avatar_url TEXT,
        bio TEXT,
        website TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Create topics table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        question TEXT NOT NULL,
        category TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `)

    // Create messages table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        image_url TEXT,
        parent_id UUID REFERENCES messages(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Create votes table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        is_upvote BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(message_id, user_id)
      );
    `)

    // Create reactions table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS reactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        emoji TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(message_id, user_id, emoji)
      );
    `)

    // Create user_settings table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        theme TEXT DEFAULT 'dark',
        notifications_enabled BOOLEAN DEFAULT TRUE,
        direct_messages_enabled BOOLEAN DEFAULT TRUE,
        private_profile BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Create follows table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS follows (
        follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (follower_id, following_id)
      );
    `)

    // Create blocked_users table
    await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS blocked_users (
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        blocked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, blocked_user_id)
      );
    `)

    // Create RLS policies
    await supabaseAdmin.query(`
      -- Profiles policies
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Public profiles are viewable by everyone"
      ON profiles FOR SELECT
      USING (true);
      
      CREATE POLICY "Users can insert their own profile"
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
      
      CREATE POLICY "Users can update their own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
      
      -- Topics policies
      ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Topics are viewable by everyone"
      ON topics FOR SELECT
      USING (true);
      
      -- Messages policies
      ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Messages are viewable by everyone"
      ON messages FOR SELECT
      USING (true);
      
      CREATE POLICY "Users can insert their own messages"
      ON messages FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own messages"
      ON messages FOR UPDATE
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can delete their own messages"
      ON messages FOR DELETE
      USING (auth.uid() = user_id);
      
      -- Votes policies
      ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Votes are viewable by everyone"
      ON votes FOR SELECT
      USING (true);
      
      CREATE POLICY "Users can insert their own votes"
      ON votes FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own votes"
      ON votes FOR UPDATE
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can delete their own votes"
      ON votes FOR DELETE
      USING (auth.uid() = user_id);
      
      -- Reactions policies
      ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Reactions are viewable by everyone"
      ON reactions FOR SELECT
      USING (true);
      
      CREATE POLICY "Users can insert their own reactions"
      ON reactions FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can delete their own reactions"
      ON reactions FOR DELETE
      USING (auth.uid() = user_id);
      
      -- User settings policies
      ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view their own settings"
      ON user_settings FOR SELECT
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own settings"
      ON user_settings FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own settings"
      ON user_settings FOR UPDATE
      USING (auth.uid() = user_id);
      
      -- Follows policies
      ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Follows are viewable by everyone"
      ON follows FOR SELECT
      USING (true);
      
      CREATE POLICY "Users can follow others"
      ON follows FOR INSERT
      WITH CHECK (auth.uid() = follower_id);
      
      CREATE POLICY "Users can unfollow others"
      ON follows FOR DELETE
      USING (auth.uid() = follower_id);
      
      -- Blocked users policies
      ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view who they blocked"
      ON blocked_users FOR SELECT
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can block others"
      ON blocked_users FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can unblock others"
      ON blocked_users FOR DELETE
      USING (auth.uid() = user_id);
    `)

    return NextResponse.json({ success: true, message: "Database schema created successfully" })
  } catch (error) {
    console.error("Error setting up database schema:", error)
    return NextResponse.json({ success: false, error: "Failed to set up database schema" }, { status: 500 })
  }
}
