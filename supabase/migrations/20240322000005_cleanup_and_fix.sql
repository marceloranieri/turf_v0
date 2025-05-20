-- First, drop all existing policies
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname IN ('public', 'storage')) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Now apply our comprehensive security fix

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_debate_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for each table

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Topics policies
CREATE POLICY "Topics are viewable by everyone" 
  ON public.topics FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create topics" 
  ON public.topics FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own topics" 
  ON public.topics FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own topics" 
  ON public.topics FOR DELETE 
  USING (auth.uid() = created_by);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON public.comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.comments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE 
  USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" 
  ON public.likes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create likes" 
  ON public.likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.likes FOR DELETE 
  USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can read their own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can read their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can delete their own notifications" 
  ON public.notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can read their own settings" 
  ON public.user_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON public.user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Daily debate topics policies
CREATE POLICY "Daily debate topics are viewable by everyone" 
  ON public.daily_debate_topics FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage daily debate topics" 
  ON public.daily_debate_topics FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Participations policies
CREATE POLICY "Participations are viewable by everyone" 
  ON public.participations FOR SELECT 
  USING (true);

CREATE POLICY "Users can join topics" 
  ON public.participations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave topics" 
  ON public.participations FOR DELETE 
  USING (auth.uid() = user_id);

-- Topic suggestions policies
CREATE POLICY "Topic suggestions are viewable by everyone" 
  ON public.topic_suggestions FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create suggestions" 
  ON public.topic_suggestions FOR INSERT 
  WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "Only admins can update suggestions" 
  ON public.topic_suggestions FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Suggestion votes policies
CREATE POLICY "Suggestion votes are viewable by everyone" 
  ON public.suggestion_votes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can vote" 
  ON public.suggestion_votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes" 
  ON public.suggestion_votes FOR DELETE 
  USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage categories" 
  ON public.categories FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Arguments policies
CREATE POLICY "Arguments are viewable by everyone" 
  ON public.arguments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create arguments" 
  ON public.arguments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own arguments" 
  ON public.arguments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own arguments" 
  ON public.arguments FOR DELETE 
  USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" 
  ON public.votes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can vote" 
  ON public.votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes" 
  ON public.votes FOR DELETE 
  USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone" 
  ON public.achievements FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage achievements" 
  ON public.achievements FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- User achievements policies
CREATE POLICY "User achievements are viewable by everyone" 
  ON public.user_achievements FOR SELECT 
  USING (true);

CREATE POLICY "Only system can manage user achievements" 
  ON public.user_achievements FOR ALL 
  USING (auth.role() = 'service_role');

-- User points policies
CREATE POLICY "User points are viewable by everyone" 
  ON public.user_points FOR SELECT 
  USING (true);

CREATE POLICY "Only system can manage user points" 
  ON public.user_points FOR ALL 
  USING (auth.role() = 'service_role');

-- Analytics cache policies
CREATE POLICY "Only service role can access analytics cache" 
  ON public.analytics_cache FOR ALL 
  USING (auth.role() = 'service_role');

-- 3. Revoke excessive public permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 4. Secure storage buckets
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Banner images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Users can upload their own banner images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- 5. Grant necessary function permissions
GRANT EXECUTE ON FUNCTION get_participation_trends TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_participation_trend TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_engagement_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_cached_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION store_analytics_cache TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_analytics_cache TO service_role;

-- 6. Verify the changes
DO $$ 
BEGIN
    -- Check RLS status
    RAISE NOTICE 'Checking RLS status...';
    IF EXISTS (
        SELECT 1 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND rowsecurity = false
    ) THEN
        RAISE EXCEPTION 'Some tables still have RLS disabled';
    END IF;

    -- Check policies
    RAISE NOTICE 'Checking policies...';
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) THEN
        RAISE EXCEPTION 'No policies found';
    END IF;

    -- Check storage policies
    RAISE NOTICE 'Checking storage policies...';
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE schemaname = 'storage'
    ) THEN
        RAISE EXCEPTION 'No storage policies found';
    END IF;

    -- Check function permissions
    RAISE NOTICE 'Checking function permissions...';
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.routine_privileges
        WHERE routine_schema = 'public'
        AND grantee = 'authenticated'
    ) THEN
        RAISE EXCEPTION 'No function permissions found';
    END IF;

    RAISE NOTICE 'All security checks passed successfully!';
END $$; 