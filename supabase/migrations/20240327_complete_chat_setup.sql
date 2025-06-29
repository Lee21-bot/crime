-- Complete chat system setup - handles all existing conflicts

-- 1. Ensure chat_messages table has all required columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'is_moderated') THEN
        ALTER TABLE chat_messages ADD COLUMN is_moderated BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'moderation_status') THEN
        ALTER TABLE chat_messages ADD COLUMN moderation_status TEXT NOT NULL DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'moderation_reason') THEN
        ALTER TABLE chat_messages ADD COLUMN moderation_reason TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'moderated_at') THEN
        ALTER TABLE chat_messages ADD COLUMN moderated_at TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'moderated_by') THEN
        ALTER TABLE chat_messages ADD COLUMN moderated_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Create chat_presence table
CREATE TABLE IF NOT EXISTS public.chat_presence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
    username TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'online',
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable RLS on all tables
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_typing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_presence ENABLE ROW LEVEL SECURITY;

-- 4. Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Only admins can update chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can read typing status" ON public.chat_typing;
DROP POLICY IF EXISTS "Users can manage their own typing status" ON public.chat_typing;
DROP POLICY IF EXISTS "Anyone can read presence status" ON public.chat_presence;
DROP POLICY IF EXISTS "Users can manage their own presence" ON public.chat_presence;

-- 5. Create new policies for chat_messages
CREATE POLICY "Anyone can read chat messages"
    ON public.chat_messages FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert chat messages"
    ON public.chat_messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update chat messages"
    ON public.chat_messages FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND email LIKE '%@admin.com'
        )
    );

-- 6. Create new policies for chat_typing
CREATE POLICY "Anyone can read typing status"
    ON public.chat_typing FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own typing status"
    ON public.chat_typing FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Create new policies for chat_presence
CREATE POLICY "Anyone can read presence status"
    ON public.chat_presence FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own presence"
    ON public.chat_presence FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. Create function to update last_seen
CREATE OR REPLACE FUNCTION public.update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_presence
    SET last_seen = NOW()
    WHERE user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create triggers
DROP TRIGGER IF EXISTS update_last_seen_on_message ON public.chat_messages;
CREATE TRIGGER update_last_seen_on_message
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_last_seen();

DROP TRIGGER IF EXISTS update_last_seen_on_typing ON public.chat_typing;
CREATE TRIGGER update_last_seen_on_typing
    AFTER INSERT OR UPDATE ON public.chat_typing
    FOR EACH ROW
    EXECUTE FUNCTION public.update_last_seen(); 