-- Create config table
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial config
INSERT INTO config (key, value) VALUES
  ('bots_enabled', 'true'::jsonb),
  ('monthly_token_limit', '17000000'::jsonb),
  ('alert_threshold', '0.85'::jsonb);

-- Create RLS policies
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Config table policies
CREATE POLICY "Config is viewable by everyone" ON config
  FOR SELECT USING (true);

CREATE POLICY "Config is updatable by service role" ON config
  FOR UPDATE USING (auth.role() = 'service_role');

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_config_updated_at
  BEFORE UPDATE ON config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 