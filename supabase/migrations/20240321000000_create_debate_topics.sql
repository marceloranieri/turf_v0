-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create topics table
CREATE TABLE topics (
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

-- Create daily_topics table
CREATE TABLE daily_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on daily_topics date column for better query performance
CREATE INDEX idx_daily_topics_date ON daily_topics(date);

-- Enable Row Level Security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_topics ENABLE ROW LEVEL SECURITY;

-- Create policies for topics table
CREATE POLICY "Topics are viewable by everyone" ON topics
    FOR SELECT USING (true);

CREATE POLICY "Topics are insertable by authenticated users" ON topics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for daily_topics table
CREATE POLICY "Daily topics are viewable by everyone" ON daily_topics
    FOR SELECT USING (true);

CREATE POLICY "Daily topics are insertable by authenticated users" ON daily_topics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 