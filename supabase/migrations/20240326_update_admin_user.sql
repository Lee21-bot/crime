-- Get the user ID from the email
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = current_user;

    -- Create or update user profile as admin
    INSERT INTO public.user_profiles (user_id, is_admin, created_at, updated_at)
    VALUES (target_user_id, true, NOW(), NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        is_admin = true,
        updated_at = NOW();

    -- Create or update subscription as active investigator
    INSERT INTO public.user_subscriptions (
        user_id,
        tier,
        status,
        created_at,
        updated_at,
        expires_at
    )
    VALUES (
        target_user_id,
        'investigator',
        'active',
        NOW(),
        NOW(),
        NOW() + INTERVAL '1 year'
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        tier = 'investigator',
        status = 'active',
        updated_at = NOW(),
        expires_at = NOW() + INTERVAL '1 year';
END $$; 