import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixUserProfilesRLS() {
  try {
    console.log('Fixing RLS policies for user_profiles table...')

    // Enable RLS and add policies for user_profiles
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
        
        CREATE POLICY "Users can view their own profile"
        ON user_profiles FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
        
        CREATE POLICY "Users can insert their own profile"
        ON user_profiles FOR INSERT
        TO authenticated
        WITH CHECK (user_id = auth.uid());
        
        CREATE POLICY "Users can update their own profile"
        ON user_profiles FOR UPDATE
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
      `
    })

    if (rlsError) {
      console.error('Error setting up RLS policies for user_profiles:', rlsError)
      return
    }

    console.log('✅ RLS policies for user_profiles fixed successfully!')

  } catch (error) {
    console.error('Failed to fix user_profiles RLS:', error)
  }
}

fixUserProfilesRLS() 