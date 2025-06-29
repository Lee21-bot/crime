const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUserProfilesSchema() {
  try {
    console.log('Checking user_profiles table schema...')
    
    // Query to get table information
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: 'user_profiles' })
    
    if (error) {
      console.log('RPC not available, trying direct query...')
      
      // Try a simple select to see what columns exist
      const { data: sampleData, error: sampleError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1)
      
      if (sampleError) {
        console.error('Error querying user_profiles:', sampleError)
        return
      }
      
      console.log('Sample data structure:', sampleData)
      return
    }
    
    console.log('Table columns:', data)
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

checkUserProfilesSchema() 