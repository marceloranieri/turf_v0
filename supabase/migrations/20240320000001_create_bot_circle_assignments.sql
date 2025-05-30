-- Create bot_circle_assignment table
CREATE TABLE IF NOT EXISTS public.bot_circle_assignment (
    bot_id TEXT REFERENCES public.bots(bot_id) ON DELETE CASCADE,
    circle_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (bot_id, circle_id)
);

-- Add RLS policies
ALTER TABLE public.bot_circle_assignment ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.bot_circle_assignment
    FOR SELECT
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON public.bot_circle_assignment
    USING (auth.role() = 'service_role'); 