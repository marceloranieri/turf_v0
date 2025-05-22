-- Security Fixes Migration
-- This migration addresses security issues identified in the Supabase Security Advisor.

-- 1. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- 2. Enable RLS on topics table
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Create policies for topics
CREATE POLICY "Anyone can read topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create topics" ON public.topics FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own topics" ON public.topics FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own topics" ON public.topics FOR DELETE USING (auth.uid() = created_by);

-- 3. Enable RLS on comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Anyone can read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- 4. Enable RLS on likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Anyone can read likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- 5. Enable RLS on bookmarks table
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can read their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 6. Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can read their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- 7. Enable RLS on user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can read their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Enable RLS on daily_debate_topics table
ALTER TABLE public.daily_debate_topics ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_debate_topics
CREATE POLICY "Anyone can read daily debate topics" ON public.daily_debate_topics FOR SELECT USING (true);
CREATE POLICY "Only admins can insert daily debate topics" ON public.daily_debate_topics FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- 9. Enable RLS on participations table
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;

-- Create policies for participations
CREATE POLICY "Anyone can read participations" ON public.participations FOR SELECT USING (true);
CREATE POLICY "Users can join topics" ON public.participations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave topics" ON public.participations FOR DELETE USING (auth.uid() = user_id);

-- 10. Enable RLS on topic_suggestions table
ALTER TABLE public.topic_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies for topic_suggestions
CREATE POLICY "Anyone can read topic suggestions" ON public.topic_suggestions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create suggestions" ON public.topic_suggestions FOR INSERT WITH CHECK (auth.uid() = suggested_by);
CREATE POLICY "Only admins can update suggestions" ON public.topic_suggestions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 11. Enable RLS on suggestion_votes table
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for suggestion_votes
CREATE POLICY "Anyone can read suggestion votes" ON public.suggestion_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.suggestion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own votes" ON public.suggestion_votes FOR DELETE USING (auth.uid() = user_id);

-- 12. Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 13. Enable RLS on arguments table
ALTER TABLE public.arguments ENABLE ROW LEVEL SECURITY;

-- Create policies for arguments
CREATE POLICY "Anyone can read arguments" ON public.arguments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create arguments" ON public.arguments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own arguments" ON public.arguments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own arguments" ON public.arguments FOR DELETE USING (auth.uid() = user_id);

-- 14. Enable RLS on votes table
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policies for votes
CREATE POLICY "Anyone can read votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own votes" ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- 15. Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Only admins can manage achievements" ON public.achievements FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 16. Enable RLS on user_achievements table
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user_achievements
CREATE POLICY "Anyone can read user achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Only system can manage user achievements" ON public.user_achievements FOR ALL USING (false);

-- 17. Enable RLS on user_points table
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Create policies for user_points
CREATE POLICY "Anyone can read user points" ON public.user_points FOR SELECT USING (true);
CREATE POLICY "Only system can manage user points" ON public.user_points FOR ALL USING (false);

-- 18. Enable RLS on analytics_cache table
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_cache
CREATE POLICY "Only service role can access analytics cache" ON public.analytics_cache FOR ALL USING (auth.role() = 'service_role');

-- 19. Enable RLS on daily_topics table
ALTER TABLE public.daily_topics ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_topics
CREATE POLICY "Anyone can read daily topics" ON public.daily_topics FOR SELECT USING (true);
CREATE POLICY "Only admins can manage daily topics" ON public.daily_topics FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 20. Revoke excessive public permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 21. Secure storage buckets
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

-- 22. Grant necessary function permissions
GRANT EXECUTE ON FUNCTION get_participation_trends TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_participation_trend TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_engagement_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_cached_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION store_analytics_cache TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_analytics_cache TO service_role; 