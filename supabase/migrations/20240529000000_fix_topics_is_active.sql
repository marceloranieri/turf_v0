-- Ensure is_active column exists and has the correct default value
DO $$ 
BEGIN
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'topics' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE topics ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;

    -- Update any NULL values to TRUE
    UPDATE topics SET is_active = TRUE WHERE is_active IS NULL;

    -- Make sure the column is NOT NULL
    ALTER TABLE topics ALTER COLUMN is_active SET NOT NULL;
    ALTER TABLE topics ALTER COLUMN is_active SET DEFAULT TRUE;
END $$; 