-- Create function to get user participation trends
CREATE OR REPLACE FUNCTION get_user_participation_trend(
  user_id UUID,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  date_day DATE,
  comments_count INTEGER,
  topics_joined INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  start_date DATE := CURRENT_DATE - days_back::INTEGER;
  end_date DATE := CURRENT_DATE;
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(start_date, end_date, '1 day'::interval)::DATE AS date_day
  ),
  user_comments AS (
    SELECT 
      DATE(created_at) AS comment_date,
      COUNT(*) AS daily_comments
    FROM comments
    WHERE user_id = get_user_participation_trend.user_id
      AND created_at >= start_date
      AND created_at <= end_date + interval '1 day'
    GROUP BY comment_date
  ),
  user_joins AS (
    SELECT 
      DATE(created_at) AS join_date,
      COUNT(*) AS daily_joins
    FROM participations
    WHERE user_id = get_user_participation_trend.user_id
      AND created_at >= start_date
      AND created_at <= end_date + interval '1 day'
    GROUP BY join_date
  )
  SELECT
    ds.date_day,
    COALESCE(uc.daily_comments, 0) AS comments_count,
    COALESCE(uj.daily_joins, 0) AS topics_joined
  FROM date_series ds
  LEFT JOIN user_comments uc ON ds.date_day = uc.comment_date
  LEFT JOIN user_joins uj ON ds.date_day = uj.join_date
  ORDER BY ds.date_day ASC;
END;
$$;

-- Create function to get user engagement metrics
CREATE OR REPLACE FUNCTION get_user_engagement_metrics(
  user_id UUID,
  time_range TEXT DEFAULT 'monthly'
)
RETURNS TABLE(
  metric_name TEXT,
  current_value INTEGER,
  previous_value INTEGER,
  change_percentage NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
  start_date TIMESTAMPTZ;
  previous_start_date TIMESTAMPTZ;
BEGIN
  -- Set date ranges based on time_range
  CASE time_range
    WHEN 'weekly' THEN
      start_date := NOW() - interval '7 days';
      previous_start_date := start_date - interval '7 days';
    WHEN 'monthly' THEN
      start_date := NOW() - interval '30 days';
      previous_start_date := start_date - interval '30 days';
    WHEN 'quarterly' THEN
      start_date := NOW() - interval '90 days';
      previous_start_date := start_date - interval '90 days';
    ELSE
      start_date := NOW() - interval '30 days';
      previous_start_date := start_date - interval '30 days';
  END CASE;

  RETURN QUERY
  WITH current_period AS (
    SELECT
      COUNT(DISTINCT t.id) AS topics_created,
      COUNT(DISTINCT p.topic_id) AS topics_joined,
      COUNT(DISTINCT c.id) AS comments_posted,
      COUNT(DISTINCT v.id) AS votes_cast
    FROM (SELECT 1) AS dummy
    LEFT JOIN topics t ON t.created_by = get_user_engagement_metrics.user_id
      AND t.created_at >= start_date
    LEFT JOIN participations p ON p.user_id = get_user_engagement_metrics.user_id
      AND p.created_at >= start_date
    LEFT JOIN comments c ON c.user_id = get_user_engagement_metrics.user_id
      AND c.created_at >= start_date
    LEFT JOIN suggestion_votes v ON v.user_id = get_user_engagement_metrics.user_id
      AND v.created_at >= start_date
  ),
  previous_period AS (
    SELECT
      COUNT(DISTINCT t.id) AS topics_created,
      COUNT(DISTINCT p.topic_id) AS topics_joined,
      COUNT(DISTINCT c.id) AS comments_posted,
      COUNT(DISTINCT v.id) AS votes_cast
    FROM (SELECT 1) AS dummy
    LEFT JOIN topics t ON t.created_by = get_user_engagement_metrics.user_id
      AND t.created_at >= previous_start_date
      AND t.created_at < start_date
    LEFT JOIN participations p ON p.user_id = get_user_engagement_metrics.user_id
      AND p.created_at >= previous_start_date
      AND p.created_at < start_date
    LEFT JOIN comments c ON c.user_id = get_user_engagement_metrics.user_id
      AND c.created_at >= previous_start_date
      AND c.created_at < start_date
    LEFT JOIN suggestion_votes v ON v.user_id = get_user_engagement_metrics.user_id
      AND v.created_at >= previous_start_date
      AND v.created_at < start_date
  )
  SELECT
    'Topics Created'::TEXT,
    cp.topics_created,
    pp.topics_created,
    CASE 
      WHEN pp.topics_created = 0 THEN 100
      ELSE ROUND(((cp.topics_created::NUMERIC - pp.topics_created) / pp.topics_created) * 100, 1)
    END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT
    'Topics Joined'::TEXT,
    cp.topics_joined,
    pp.topics_joined,
    CASE 
      WHEN pp.topics_joined = 0 THEN 100
      ELSE ROUND(((cp.topics_joined::NUMERIC - pp.topics_joined) / pp.topics_joined) * 100, 1)
    END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT
    'Comments Posted'::TEXT,
    cp.comments_posted,
    pp.comments_posted,
    CASE 
      WHEN pp.comments_posted = 0 THEN 100
      ELSE ROUND(((cp.comments_posted::NUMERIC - pp.comments_posted) / pp.comments_posted) * 100, 1)
    END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT
    'Votes Cast'::TEXT,
    cp.votes_cast,
    pp.votes_cast,
    CASE 
      WHEN pp.votes_cast = 0 THEN 100
      ELSE ROUND(((cp.votes_cast::NUMERIC - pp.votes_cast) / pp.votes_cast) * 100, 1)
    END
  FROM current_period cp, previous_period pp;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_user_created ON comments(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_participations_user_created ON participations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_topics_created_by_created ON topics(created_by, created_at);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_user_created ON suggestion_votes(user_id, created_at);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_user_participation_trend TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_engagement_metrics TO authenticated; 