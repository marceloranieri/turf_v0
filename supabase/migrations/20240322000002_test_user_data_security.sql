-- Test User Data Security Policies
-- This migration contains test cases for the RLS policies implemented in 20240322000001_user_data_security.sql

-- Test user_settings policies
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000000';
    other_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Test unauthenticated access (should fail)
    BEGIN
        SET LOCAL ROLE anon;
        -- Should fail
        INSERT INTO user_settings (user_id, theme) VALUES (test_user_id, 'dark');
        RAISE EXCEPTION 'Test failed: Unauthenticated user was able to insert settings';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected error
    END;

    -- Test authenticated user access
    BEGIN
        SET LOCAL ROLE authenticated;
        -- Should succeed
        INSERT INTO user_settings (user_id, theme) VALUES (test_user_id, 'dark');
        -- Should succeed
        SELECT * FROM user_settings WHERE user_id = test_user_id;
        -- Should fail
        SELECT * FROM user_settings WHERE user_id = other_user_id;
        -- Should fail
        UPDATE user_settings SET theme = 'light' WHERE user_id = other_user_id;
    END;
END $$;

-- Test notifications policies
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000000';
    other_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Test unauthenticated access (should fail)
    BEGIN
        SET LOCAL ROLE anon;
        -- Should fail
        INSERT INTO notifications (user_id, message) VALUES (test_user_id, 'Test notification');
        RAISE EXCEPTION 'Test failed: Unauthenticated user was able to create notification';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected error
    END;

    -- Test authenticated user access
    BEGIN
        SET LOCAL ROLE authenticated;
        -- Should succeed
        INSERT INTO notifications (user_id, message) VALUES (test_user_id, 'Test notification');
        -- Should succeed
        SELECT * FROM notifications WHERE user_id = test_user_id;
        -- Should fail
        SELECT * FROM notifications WHERE user_id = other_user_id;
        -- Should fail
        DELETE FROM notifications WHERE user_id = other_user_id;
    END;
END $$;

-- Test bookmarks policies
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000000';
    other_user_id UUID := '11111111-1111-1111-1111-111111111111';
    test_topic_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
    -- Test unauthenticated access (should fail)
    BEGIN
        SET LOCAL ROLE anon;
        -- Should fail
        INSERT INTO bookmarks (user_id, topic_id) VALUES (test_user_id, test_topic_id);
        RAISE EXCEPTION 'Test failed: Unauthenticated user was able to create bookmark';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected error
    END;

    -- Test authenticated user access
    BEGIN
        SET LOCAL ROLE authenticated;
        -- Should succeed
        INSERT INTO bookmarks (user_id, topic_id) VALUES (test_user_id, test_topic_id);
        -- Should succeed
        SELECT * FROM bookmarks WHERE user_id = test_user_id;
        -- Should fail
        SELECT * FROM bookmarks WHERE user_id = other_user_id;
        -- Should fail
        DELETE FROM bookmarks WHERE user_id = other_user_id;
    END;
END $$;

-- Test likes policies
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000000';
    other_user_id UUID := '11111111-1111-1111-1111-111111111111';
    test_topic_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
    -- Test unauthenticated access
    BEGIN
        SET LOCAL ROLE anon;
        -- Should succeed (public read)
        SELECT * FROM likes;
        -- Should fail
        INSERT INTO likes (user_id, topic_id) VALUES (test_user_id, test_topic_id);
        RAISE EXCEPTION 'Test failed: Unauthenticated user was able to create like';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected error
    END;

    -- Test authenticated user access
    BEGIN
        SET LOCAL ROLE authenticated;
        -- Should succeed
        INSERT INTO likes (user_id, topic_id) VALUES (test_user_id, test_topic_id);
        -- Should succeed
        SELECT * FROM likes WHERE user_id = test_user_id;
        -- Should fail
        DELETE FROM likes WHERE user_id = other_user_id;
    END;
END $$;

-- Clean up test data
DELETE FROM user_settings WHERE user_id IN ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111');
DELETE FROM notifications WHERE user_id IN ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111');
DELETE FROM bookmarks WHERE user_id IN ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111');
DELETE FROM likes WHERE user_id IN ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'); 