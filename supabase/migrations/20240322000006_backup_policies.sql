-- Backup of current policies and permissions
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Create a temporary table to store current policies
    CREATE TEMP TABLE IF NOT EXISTS policy_backup (
        schemaname text,
        tablename text,
        policyname text,
        permissive text,
        roles text[],
        cmd text,
        qual text,
        with_check text
    );

    -- Store current policies
    INSERT INTO policy_backup
    SELECT * FROM pg_policies 
    WHERE schemaname IN ('public', 'storage');

    -- Store current permissions
    CREATE TEMP TABLE IF NOT EXISTS permission_backup AS
    SELECT 
        grantee,
        table_schema,
        table_name,
        privilege_type
    FROM information_schema.table_privileges
    WHERE table_schema = 'public';

    -- Store RLS status
    CREATE TEMP TABLE IF NOT EXISTS rls_backup AS
    SELECT 
        tablename,
        rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public';

    RAISE NOTICE 'Backup completed successfully';
END $$; 