-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  duration_days INTEGER DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'scheduled',
  tags TEXT[]
);

-- Topic participations table
CREATE TABLE IF NOT EXISTS participations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_id UUID REFERENCES comments(id)
);

-- Topic suggestions table
CREATE TABLE IF NOT EXISTS topic_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  justification TEXT NOT NULL,
  tags TEXT[],
  suggested_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  votes INTEGER DEFAULT 0
);

-- Suggestion votes table
CREATE TABLE IF NOT EXISTS suggestion_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suggestion_id UUID REFERENCES topic_suggestions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(suggestion_id, user_id)
);

-- Create stored procedure for voting
CREATE OR REPLACE FUNCTION vote_for_suggestion(suggestion_id UUID, user_id UUID)
RETURNS void AS $$
BEGIN
  -- Insert vote record
  INSERT INTO suggestion_votes (suggestion_id, user_id)
  VALUES (suggestion_id, user_id);
  
  -- Update vote count
  UPDATE topic_suggestions
  SET votes = votes + 1
  WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure for removing votes
CREATE OR REPLACE FUNCTION remove_vote_from_suggestion(suggestion_id UUID, user_id UUID)
RETURNS void AS $$
BEGIN
  -- Delete vote record
  DELETE FROM suggestion_votes
  WHERE suggestion_id = $1 AND user_id = $2;
  
  -- Update vote count
  UPDATE topic_suggestions
  SET votes = votes - 1
  WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;

-- Topic policies
CREATE POLICY "Topics are viewable by everyone" 
ON topics FOR SELECT USING (true);

CREATE POLICY "Topics can be created by authenticated users" 
ON topics FOR INSERT TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Topics can be updated by creator or admin" 
ON topics FOR UPDATE TO authenticated USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Topics can be deleted by creator or admin" 
ON topics FOR DELETE TO authenticated USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Participation policies
CREATE POLICY "Participations are viewable by everyone" 
ON participations FOR SELECT USING (true);

CREATE POLICY "Users can join topics" 
ON participations FOR INSERT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can leave topics" 
ON participations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comment policies
CREATE POLICY "Comments are viewable by everyone" 
ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add comments" 
ON comments FOR INSERT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Suggestion policies
CREATE POLICY "Suggestions are viewable by everyone" 
ON topic_suggestions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add suggestions" 
ON topic_suggestions FOR INSERT TO authenticated USING (auth.uid() = suggested_by);

CREATE POLICY "Only admins can update suggestions" 
ON topic_suggestions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Vote policies
CREATE POLICY "Votes are viewable by everyone" 
ON suggestion_votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" 
ON suggestion_votes FOR INSERT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes" 
ON suggestion_votes FOR DELETE TO authenticated USING (auth.uid() = user_id); 