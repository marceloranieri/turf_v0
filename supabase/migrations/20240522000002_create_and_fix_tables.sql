-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_shown TIMESTAMP WITH TIME ZONE,
    times_shown INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create daily_topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on daily_topics date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_daily_topics_date') THEN
        CREATE INDEX idx_daily_topics_date ON daily_topics(date);
    END IF;
END $$;

-- Enable Row Level Security if not already enabled
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_topics ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topics' AND policyname = 'Topics are viewable by everyone') THEN
        CREATE POLICY "Topics are viewable by everyone" ON topics
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topics' AND policyname = 'Topics are insertable by authenticated users') THEN
        CREATE POLICY "Topics are insertable by authenticated users" ON topics
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_topics' AND policyname = 'Daily topics are viewable by everyone') THEN
        CREATE POLICY "Daily topics are viewable by everyone" ON daily_topics
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_topics' AND policyname = 'Daily topics are insertable by authenticated users') THEN
        CREATE POLICY "Daily topics are insertable by authenticated users" ON daily_topics
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;

-- Now fix the foreign key constraint
DO $$ 
BEGIN
    -- Drop the existing foreign key constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'daily_topics_topic_id_fkey') THEN
        ALTER TABLE daily_topics DROP CONSTRAINT daily_topics_topic_id_fkey;
    END IF;

    -- Add the new foreign key constraint with RESTRICT
    ALTER TABLE daily_topics ADD CONSTRAINT daily_topics_topic_id_fkey
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE RESTRICT;
END $$;
