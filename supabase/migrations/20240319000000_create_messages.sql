-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to read all messages
CREATE POLICY "Allow users to read all messages"
  ON messages FOR SELECT
  USING (true);

-- Allow users to insert their own messages
CREATE POLICY "Allow users to insert their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own messages
CREATE POLICY "Allow users to update their own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own messages
CREATE POLICY "Allow users to delete their own messages"
  ON messages FOR DELETE
  USING (auth.uid() = user_id); 