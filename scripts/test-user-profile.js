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

async function testUserProfile() {
  try {
    console.log('Testing user_profiles table...')

    // First, let's check the table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)

    console.log('Table info:', tableInfo)
    if (tableError) {
      console.error('Error accessing table:', tableError)
    }

    // Let's also check if there are any existing profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')

    console.log('Existing profiles:', profiles)
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
    }

    // Test a simple insert
    const testUserId = 'af258c4e-5a04-4718-803e-122f2b5e4dd2' // Your user ID
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: testUserId,
        display_name: 'Test User',
        updated_at: new Date().toISOString()
      })
      .select()

    console.log('Insert result:', { insertData, insertError })

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testUserProfile() 