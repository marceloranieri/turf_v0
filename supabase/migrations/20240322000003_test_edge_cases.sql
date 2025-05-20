-- Test Edge Cases and Performance
-- This migration tests edge cases and performance impact of RLS policies

-- Test null user IDs and pre-RLS data
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000000';
    null_user_id UUID := NULL;
    deleted_user_id UUID := '33333333-3333-3333-3333-333333333333';
    test_topic_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
    -- Test null user IDs
    BEGIN
        SET LOCAL ROLE authenticated;
        -- Should fail
        INSERT INTO user_settings (user_id, theme) VALUES (null_user_id, 'dark');
        RAISE EXCEPTION 'Test failed: Was able to insert settings with null user_id';
    EXCEPTION WHEN check_violation THEN
        -- Expected error
    END;

    -- Test deleted user scenario
    BEGIN
        -- Create a user and some data
        INSERT INTO auth.users (id, email) VALUES (deleted_user_id, 'deleted@example.com');
        INSERT INTO user_settings (user_id, theme) VALUES (deleted_user_id, 'dark');
        INSERT INTO notifications (user_id, message) VALUES (deleted_user_id, 'Test notification');
        INSERT INTO bookmarks (user_id, topic_id) VALUES (deleted_user_id, test_topic_id);
        INSERT INTO likes (user_id, topic_id) VALUES (deleted_user_id, test_topic_id);

        -- Delete the user
        DELETE FROM auth.users WHERE id = deleted_user_id;

        -- Verify orphaned data is still protected
        SET LOCAL ROLE authenticated;
        -- Should fail
        SELECT * FROM user_settings WHERE user_id = deleted_user_id;
        -- Should fail
        SELECT * FROM notifications WHERE user_id = deleted_user_id;
        -- Should fail
        SELECT * FROM bookmarks WHERE user_id = deleted_user_id;
        -- Should fail
        SELECT * FROM likes WHERE user_id = deleted_user_id;
    END;
END $$;

-- Test performance impact
DO $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    iterations INTEGER := 1000;
    i INTEGER;
BEGIN
    -- Create test data
    INSERT INTO user_settings (user_id, theme)
    SELECT 
        gen_random_uuid(),
        CASE WHEN random() > 0.5 THEN 'dark' ELSE 'light' END
    FROM generate_series(1, iterations);

    -- Test SELECT performance
    start_time := clock_timestamp();
    FOR i IN 1..iterations LOOP
        PERFORM * FROM user_settings WHERE theme = 'dark';
    END LOOP;
    end_time := clock_timestamp();
    RAISE NOTICE 'SELECT performance: % ms for % iterations', 
        extract(epoch from (end_time - start_time)) * 1000, 
        iterations;

    -- Test INSERT performance
    start_time := clock_timestamp();
    FOR i IN 1..iterations LOOP
        INSERT INTO user_settings (user_id, theme)
        VALUES (gen_random_uuid(), 'dark');
    END LOOP;
    end_time := clock_timestamp();
    RAISE NOTICE 'INSERT performance: % ms for % iterations', 
        extract(epoch from (end_time - start_time)) * 1000, 
        iterations;

    -- Test UPDATE performance
    start_time := clock_timestamp();
    FOR i IN 1..iterations LOOP
        UPDATE user_settings 
        SET theme = 'light' 
        WHERE user_id = (
            SELECT user_id 
            FROM user_settings 
            ORDER BY random() 
            LIMIT 1
        );
    END LOOP;
    end_time := clock_timestamp();
    RAISE NOTICE 'UPDATE performance: % ms for % iterations', 
        extract(epoch from (end_time - start_time)) * 1000, 
        iterations;
END $$;

-- Test concurrent access
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000000';
    other_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Create test data
    INSERT INTO user_settings (user_id, theme) VALUES (test_user_id, 'dark');
    INSERT INTO user_settings (user_id, theme) VALUES (other_user_id, 'light');

    -- Test concurrent updates
    BEGIN
        -- Simulate concurrent updates
        SET LOCAL ROLE authenticated;
        SET LOCAL "request.jwt.claim.sub" TO test_user_id;
        
        -- First transaction
        BEGIN;
        UPDATE user_settings SET theme = 'dark' WHERE user_id = test_user_id;
        
        -- Second transaction (should be blocked by RLS)
        SET LOCAL "request.jwt.claim.sub" TO other_user_id;
        UPDATE user_settings SET theme = 'light' WHERE user_id = test_user_id;
        COMMIT;
        
        -- Verify the update was protected
        ASSERT (
            SELECT theme 
            FROM user_settings 
            WHERE user_id = test_user_id
        ) = 'dark', 'Concurrent update protection failed';
    END;
END $$;

-- Clean up test data
DELETE FROM user_settings WHERE user_id IN (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333'
);
DELETE FROM notifications WHERE user_id IN (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333'
);
DELETE FROM bookmarks WHERE user_id IN (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333'
);
DELETE FROM likes WHERE user_id IN (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333'
); 