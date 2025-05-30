-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_shown TIMESTAMP WITH TIME ZONE,
  times_shown INTEGER DEFAULT 0
);

-- Add RLS policies
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Allow users to read all topics
CREATE POLICY "Allow users to read all topics"
  ON topics FOR SELECT
  USING (true);

-- Allow users to insert their own topics
CREATE POLICY "Allow users to insert their own topics"
  ON topics FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own topics
CREATE POLICY "Allow users to update their own topics"
  ON topics FOR UPDATE
  USING (auth.uid() = created_by);

-- Allow users to delete their own topics
CREATE POLICY "Allow users to delete their own topics"
  ON topics FOR DELETE
  USING (auth.uid() = created_by); 