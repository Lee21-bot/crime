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

async function verifyColorColumn() {
  try {
    console.log('Checking user_profiles table structure...')
    
    // Check if color column exists
    const { data: columns, error: columnError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (columnError) {
      console.error('Error checking table:', columnError)
      return
    }
    
    console.log('Table columns:', Object.keys(columns[0] || {}))
    
    // Check if color column is present
    if (columns[0] && 'color' in columns[0]) {
      console.log('✅ Color column exists!')
    } else {
      console.log('❌ Color column does not exist')
      console.log('Available columns:', Object.keys(columns[0] || {}))
    }
    
    // Check current user profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (profileError) {
      console.error('Error fetching profiles:', profileError)
      return
    }
    
    console.log('\nCurrent user profiles:')
    profiles.forEach(profile => {
      console.log(`- User ${profile.user_id}: display_name="${profile.display_name}", color="${profile.color}"`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

verifyColorColumn() 