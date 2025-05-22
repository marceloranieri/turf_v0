-- Create function to get participation trends
CREATE OR REPLACE FUNCTION get_participation_trends(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  interval TEXT
)
RETURNS TABLE (
  date TIMESTAMPTZ,
  participants BIGINT,
  comments BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      date_trunc(interval, start_date),
      date_trunc(interval, end_date),
      CASE interval
        WHEN 'day' THEN '1 day'::interval
        WHEN 'week' THEN '1 week'::interval
        WHEN 'month' THEN '1 month'::interval
        ELSE '1 day'::interval
      END
    ) AS date
  ),
  participation_counts AS (
    SELECT
      date_trunc(interval, participations.created_at) AS date,
      COUNT(DISTINCT participations.user_id) AS participants,
      COUNT(DISTINCT comments.id) AS comments
    FROM participations
    LEFT JOIN comments ON comments.topic_id = participations.topic_id
    WHERE participations.created_at BETWEEN start_date AND end_date
    GROUP BY date_trunc(interval, participations.created_at)
  )
  SELECT
    ds.date,
    COALESCE(pc.participants, 0) AS participants,
    COALESCE(pc.comments, 0) AS comments
  FROM date_series ds
  LEFT JOIN participation_counts pc ON pc.date = ds.date
  ORDER BY ds.date;
END;
$$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_participations_created_at ON participations(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_participation_trends TO authenticated;
GRANT EXECUTE ON FUNCTION get_participation_trends TO service_role; 