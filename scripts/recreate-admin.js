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

async function recreateAdminUser() {
  console.log('Recreating admin user...')

  try {
    // First, let's try to sign in with the existing admin to get the user ID
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@shadowfiles.com',
      password: 'admin123456'
    })

    if (signInData.user) {
      console.log('Found existing admin user, signing out...')
      await supabase.auth.signOut()
    }

    // Delete the old admin user profile and subscription
    console.log('Cleaning up old admin data...')
    
    // Note: We can't delete the auth user directly with anon key, but we can clean up the related data
    // The auth user will be replaced when we create a new one with the same email

    // Create the new admin user (this will replace the old one)
    console.log('Creating new admin user...')
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
      console.log('✅ New admin user created successfully!')
      console.log('Email: admin@shadowfiles.com')
      console.log('Password: admin123456')
      console.log('User ID:', authData.user.id)

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: authData.user.id,
          display_name: 'Admin User'
        }, { onConflict: 'user_id' })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      } else {
        console.log('✅ Admin profile created successfully!')
      }

      // Create admin subscription
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: authData.user.id,
          tier: 'investigator',
          status: 'active'
        }, { onConflict: 'user_id' })

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)
        console.log('⚠️  You may need to create the subscription manually in Supabase dashboard')
      } else {
        console.log('✅ Admin subscription created successfully!')
      }

      console.log('\n🎉 New admin user setup complete!')
      console.log('Since email confirmation is disabled, you can now sign in immediately!')
      console.log('Email: admin@shadowfiles.com')
      console.log('Password: admin123456')
      console.log('Go to: http://localhost:3000/auth')
    }

  } catch (error) {
    console.error('Error recreating admin user:', error)
  }
}

recreateAdminUser() 