-- Rollback script for security changes
DO $$ 
BEGIN
    -- Disable RLS on all tables
    ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.topics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.likes DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.bookmarks DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.daily_debate_topics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.participations DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.topic_suggestions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.suggestion_votes DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.arguments DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_achievements DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_points DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.analytics_cache DISABLE ROW LEVEL SECURITY;

    -- Drop all policies
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

    -- Restore public permissions
    GRANT ALL ON ALL TABLES IN SCHEMA public TO public;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

    RAISE NOTICE 'Rollback completed successfully';
END $$; 