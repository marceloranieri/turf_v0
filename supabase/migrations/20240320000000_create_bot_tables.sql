-- Create bots table
CREATE TABLE bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id TEXT UNIQUE,
  nickname TEXT,
  personality_prompt TEXT,
  behavior TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bot_circle_assignment table
CREATE TABLE bot_circle_assignment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id TEXT REFERENCES bots(bot_id),
  circle_id uuid REFERENCES circles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(bot_id, circle_id)
);

-- Create token_usage table
CREATE TABLE token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id TEXT REFERENCES bots(bot_id),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster token usage queries
CREATE INDEX idx_token_usage_created_at ON token_usage(created_at);

-- Create RLS policies
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_circle_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Bots table policies
CREATE POLICY "Bots are viewable by everyone" ON bots
  FOR SELECT USING (true);

CREATE POLICY "Bots are insertable by service role" ON bots
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Bot circle assignment policies
CREATE POLICY "Bot assignments are viewable by everyone" ON bot_circle_assignment
  FOR SELECT USING (true);

CREATE POLICY "Bot assignments are insertable by service role" ON bot_circle_assignment
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Token usage policies
CREATE POLICY "Token usage is viewable by service role" ON token_usage
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Token usage is insertable by service role" ON token_usage
  FOR INSERT WITH CHECK (auth.role() = 'service_role'); 