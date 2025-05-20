-- User Data Security Migration
-- This migration implements RLS for user-specific data tables

-- 1. Enable RLS on user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can read their own settings" 
  ON public.user_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON public.user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 2. Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can read their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
  ON public.notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- 3. Enable RLS on bookmarks table
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can read their own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. Enable RLS on likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Anyone can read likes" 
  ON public.likes FOR SELECT 
  USING (true);

CREATE POLICY "Users can create likes" 
  ON public.likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.likes FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. Revoke excessive public permissions
REVOKE ALL ON public.user_settings FROM public;
REVOKE ALL ON public.notifications FROM public;
REVOKE ALL ON public.bookmarks FROM public;
REVOKE ALL ON public.likes FROM public;

-- 6. Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.bookmarks TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.likes TO authenticated; 