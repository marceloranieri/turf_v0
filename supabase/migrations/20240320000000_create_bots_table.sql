-- Create bots table
CREATE TABLE IF NOT EXISTS public.bots (
    bot_id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    personality_prompt TEXT NOT NULL,
    behavior TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.bots
    FOR SELECT
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON public.bots
    USING (auth.role() = 'service_role');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.bots
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 