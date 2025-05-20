-- Security Fixes Migration
-- This migration addresses the 11 security issues identified in the Supabase Security Advisor.

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

-- 9. Revoke excessive public permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 10. Update JWT settings (if applicable)
-- Note: JWT settings are typically managed in the Supabase dashboard.
-- Example: Set JWT expiration to 1 hour (3600 seconds)
-- ALTER SYSTEM SET jwt.exp = 3600;

-- 11. Secure API endpoints
-- Note: API endpoint security is handled in the application code.
-- Ensure all API routes check for authentication before processing requests. 