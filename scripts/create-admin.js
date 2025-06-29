const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  console.log('Creating admin user...')

  try {
    // Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@shadowfiles.com',
      password: 'admin123456',
      options: {
        data: { 
          display_name: 'Admin User',
          role: 'admin'
        }
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    if (authData.user) {
      console.log('✅ Admin user created successfully!')
      console.log('Email: admin@shadowfiles.com')
      console.log('Password: admin123456')
      console.log('User ID:', authData.user.id)

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          display_name: 'Admin User'
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      } else {
        console.log('✅ Admin profile created successfully!')
      }

      // Note: Subscription creation will need to be done manually in Supabase
      // due to RLS policies, or you can create it directly in the database
      console.log('⚠️  Note: Admin subscription needs to be created manually in Supabase dashboard')
      console.log('   - Go to your Supabase dashboard')
      console.log('   - Navigate to Table Editor > user_subscriptions')
      console.log('   - Add a row with:')
      console.log('     - user_id:', authData.user.id)
      console.log('     - tier: investigator')
      console.log('     - status: active')
    }

  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser() 