const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createUserProfile() {
  try {
    // Get the user ID from the logs (af258c4e-5a04-4718-803e-122f2b5e4dd2)
    const userId = 'af258c4e-5a04-4718-803e-122f2b5e4dd2'
    
    console.log('Creating user profile for:', userId)
    
    // Insert the user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: 'leeroberts3503@gmail.com',
        display_name: 'Lee',
        is_admin: true,
        membership_tier: 'investigator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) {
      console.error('Error creating user profile:', error)
      return
    }
    
    console.log('User profile created successfully:', data)
    
    // Verify the profile was created
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (verifyError) {
      console.error('Error verifying profile:', verifyError)
      return
    }
    
    console.log('Profile verification:', verifyData)
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

createUserProfile() 