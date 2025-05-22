-- Create enum for achievement types
CREATE TYPE achievement_type AS ENUM (
  'topic_creation',
  'comment_creation',
  'participation',
  'engagement',
  'milestone',
  'special'
);

-- Create enum for achievement tiers
CREATE TYPE achievement_tier AS ENUM (
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond'
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type achievement_type NOT NULL,
  tier achievement_tier NOT NULL,
  icon VARCHAR(255) NOT NULL,
  requirement INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Create user_points table
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to update user points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    UPDATE user_points
    SET total_points = total_points + (
      SELECT points FROM achievements WHERE id = NEW.achievement_id
    )
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user points
CREATE TRIGGER update_user_points_trigger
AFTER UPDATE ON user_achievements
FOR EACH ROW
EXECUTE FUNCTION update_user_points();

-- Create RLS policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view other users' achievements"
  ON user_achievements FOR SELECT
  USING (true);

-- User points policies
CREATE POLICY "Users can view their own points"
  ON user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view other users' points"
  ON user_points FOR SELECT
  USING (true);

-- Insert some initial achievements
INSERT INTO achievements (name, description, type, tier, icon, requirement, points) VALUES
-- Topic Creation Achievements
('Topic Pioneer', 'Create your first topic', 'topic_creation', 'bronze', '🎯', 1, 10),
('Topic Master', 'Create 10 topics', 'topic_creation', 'silver', '🎯', 10, 50),
('Topic Legend', 'Create 50 topics', 'topic_creation', 'gold', '🎯', 50, 100),
('Topic Virtuoso', 'Create 100 topics', 'topic_creation', 'platinum', '🎯', 100, 200),
('Topic Deity', 'Create 500 topics', 'topic_creation', 'diamond', '🎯', 500, 500),

-- Comment Creation Achievements
('Comment Novice', 'Make your first comment', 'comment_creation', 'bronze', '💭', 1, 5),
('Comment Enthusiast', 'Make 50 comments', 'comment_creation', 'silver', '💭', 50, 25),
('Comment Expert', 'Make 200 comments', 'comment_creation', 'gold', '💭', 200, 50),
('Comment Master', 'Make 500 comments', 'comment_creation', 'platinum', '💭', 500, 100),
('Comment Legend', 'Make 1000 comments', 'comment_creation', 'diamond', '💭', 1000, 200),

-- Participation Achievements
('Active Participant', 'Participate in 5 topics', 'participation', 'bronze', '🤝', 5, 15),
('Engaged Member', 'Participate in 20 topics', 'participation', 'silver', '🤝', 20, 40),
('Community Pillar', 'Participate in 50 topics', 'participation', 'gold', '🤝', 50, 75),
('Discussion Leader', 'Participate in 100 topics', 'participation', 'platinum', '🤝', 100, 150),
('Community Legend', 'Participate in 250 topics', 'participation', 'diamond', '🤝', 250, 300),

-- Engagement Achievements
('Like Collector', 'Receive 10 likes on your comments', 'engagement', 'bronze', '❤️', 10, 20),
('Popular Voice', 'Receive 50 likes on your comments', 'engagement', 'silver', '❤️', 50, 50),
('Influencer', 'Receive 200 likes on your comments', 'engagement', 'gold', '❤️', 200, 100),
('Thought Leader', 'Receive 500 likes on your comments', 'engagement', 'platinum', '❤️', 500, 200),
('Community Star', 'Receive 1000 likes on your comments', 'engagement', 'diamond', '❤️', 1000, 400),

-- Milestone Achievements
('First Week', 'Be active for 7 consecutive days', 'milestone', 'bronze', '📅', 7, 25),
('Monthly Regular', 'Be active for 30 consecutive days', 'milestone', 'silver', '📅', 30, 50),
('Quarterly Veteran', 'Be active for 90 consecutive days', 'milestone', 'gold', '📅', 90, 100),
('Yearly Champion', 'Be active for 365 consecutive days', 'milestone', 'platinum', '📅', 365, 200),
('Lifetime Member', 'Be active for 1000 consecutive days', 'milestone', 'diamond', '📅', 1000, 500),

-- Special Achievements
('Early Adopter', 'Join during the beta phase', 'special', 'bronze', '🚀', 1, 100),
('Bug Hunter', 'Report a critical bug', 'special', 'silver', '🐛', 1, 150),
('Feature Suggestion', 'Have your feature suggestion implemented', 'special', 'gold', '💡', 1, 200),
('Community Helper', 'Help moderate the community', 'special', 'platinum', '🛡️', 1, 300),
('Platform Ambassador', 'Represent the platform at an event', 'special', 'diamond', '🌟', 1, 500); 