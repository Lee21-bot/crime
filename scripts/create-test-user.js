const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTestUser() {
  try {
    console.log('Creating test user account...')
    
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'testuser2@example.com',
      password: 'testpassword123',
      email_confirm: true,
      user_metadata: {
        display_name: 'Test User'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    console.log('Auth user created:', authData.user.id)

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        display_name: 'Test User'
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      return
    }

    console.log('User profile created successfully')

    // Create free subscription
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: authData.user.id,
        tier: 'free',
        status: 'active',
        stripe_customer_id: null,
        stripe_subscription_id: null
      })

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
      return
    }

    console.log('Free subscription created successfully')
    console.log('\n✅ Test user account created successfully!')
    console.log('📧 Email: testuser@example.com')
    console.log('🔑 Password: testpassword123')
    console.log('👤 User ID:', authData.user.id)
    console.log('\nYou can now sign in with these credentials to test the free user experience.')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createTestUser() 