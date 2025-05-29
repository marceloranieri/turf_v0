-- Create reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  comment TEXT,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create moderation_log table
CREATE TABLE moderation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flagged_reporters table
CREATE TABLE flagged_reporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invalid_reports_count INTEGER DEFAULT 0,
  last_report_at TIMESTAMPTZ DEFAULT NOW(),
  is_suppressed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX reports_message_id_idx ON reports(message_id);
CREATE INDEX reports_reported_by_idx ON reports(reported_by);
CREATE INDEX reports_reported_user_id_idx ON reports(reported_user_id);
CREATE INDEX moderation_log_message_id_idx ON moderation_log(message_id);
CREATE INDEX moderation_log_user_id_idx ON moderation_log(user_id);
CREATE INDEX flagged_reporters_user_id_idx ON flagged_reporters(user_id);

-- Create RLS policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_reporters ENABLE ROW LEVEL SECURITY;

-- Reports policies
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reported_by);

CREATE POLICY "Admins can view all reports"
  ON reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Moderation log policies
CREATE POLICY "Admins can view moderation logs"
  ON moderation_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Flagged reporters policies
CREATE POLICY "Admins can view flagged reporters"
  ON flagged_reporters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to check if user is flagged
CREATE OR REPLACE FUNCTION is_user_flagged(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM flagged_reporters
    WHERE flagged_reporters.user_id = $1
    AND flagged_reporters.is_suppressed = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update flagged reporters
CREATE OR REPLACE FUNCTION update_flagged_reporter()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_valid = false THEN
    INSERT INTO flagged_reporters (user_id, invalid_reports_count, last_report_at)
    VALUES (NEW.reported_by, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET
      invalid_reports_count = flagged_reporters.invalid_reports_count + 1,
      last_report_at = NOW(),
      is_suppressed = CASE
        WHEN flagged_reporters.invalid_reports_count + 1 >= 3
        AND NOW() - flagged_reporters.last_report_at <= INTERVAL '48 hours'
        THEN true
        ELSE flagged_reporters.is_suppressed
      END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating flagged reporters
CREATE TRIGGER update_flagged_reporter_trigger
  AFTER UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_flagged_reporter();
