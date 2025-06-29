const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCurrentUser() {
  try {
    console.log('Checking current user admin status...')

    // List all users to find the current one
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error listing users:', userError)
      return
    }

    console.log(`Found ${users.users.length} users:`)
    
    users.users.forEach(user => {
      console.log(`- ${user.email} (${user.id})`)
    })

    // Check user profiles for admin status
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')

    if (profileError) {
      console.error('Error fetching profiles:', profileError)
      return
    }

    console.log('\nUser profiles:')
    profiles.forEach(profile => {
      console.log(`- User: ${profile.id}, Admin: ${profile.is_admin}, Investigator: ${profile.is_investigator}`)
    })

    // Find the user that needs admin access (likely the one you're signed in as)
    const userToUpdate = profiles.find(p => !p.is_admin)
    
    if (userToUpdate) {
      console.log(`\nUpdating user ${userToUpdate.id} to admin...`)
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          is_admin: true,
          membership_tier: 'investigator'
        })
        .eq('id', userToUpdate.id)

      if (updateError) {
        console.error('Error updating user:', updateError)
      } else {
        console.log('✅ User updated to admin successfully!')
      }
    } else {
      console.log('✅ All users already have admin access')
    }

  } catch (error) {
    console.error('Error checking user:', error)
  }
}

checkCurrentUser() 