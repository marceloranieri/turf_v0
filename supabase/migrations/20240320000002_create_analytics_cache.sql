-- Create analytics cache table
CREATE TABLE IF NOT EXISTS analytics_cache (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_analytics_cache_expires_at ON analytics_cache(expires_at);

-- Create function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_analytics_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM analytics_cache
  WHERE expires_at < NOW();
END;
$$;

-- Create function to get cached analytics data
CREATE OR REPLACE FUNCTION get_cached_analytics(
  cache_key TEXT,
  cache_duration_minutes INTEGER DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  cached_data JSONB;
BEGIN
  -- Check for valid cached data
  SELECT data INTO cached_data
  FROM analytics_cache
  WHERE key = cache_key
    AND expires_at > NOW();
    
  -- If no valid cache found, return NULL
  IF cached_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Return cached data
  RETURN cached_data;
END;
$$;

-- Create function to store analytics data in cache
CREATE OR REPLACE FUNCTION store_analytics_cache(
  cache_key TEXT,
  cache_data JSONB,
  cache_duration_minutes INTEGER DEFAULT 60
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert or update cache entry
  INSERT INTO analytics_cache (key, data, expires_at)
  VALUES (
    cache_key,
    cache_data,
    NOW() + (cache_duration_minutes || ' minutes')::INTERVAL
  )
  ON CONFLICT (key) DO UPDATE
  SET 
    data = EXCLUDED.data,
    expires_at = EXCLUDED.expires_at,
    created_at = NOW();
END;
$$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_cache TO service_role;
GRANT EXECUTE ON FUNCTION get_cached_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_cached_analytics TO service_role;
GRANT EXECUTE ON FUNCTION store_analytics_cache TO authenticated;
GRANT EXECUTE ON FUNCTION store_analytics_cache TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_analytics_cache TO service_role; 