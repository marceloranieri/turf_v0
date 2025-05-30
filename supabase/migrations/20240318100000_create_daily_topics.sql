CREATE TABLE IF NOT EXISTS daily_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: index
CREATE INDEX IF NOT EXISTS idx_daily_topics_date ON daily_topics(date); 