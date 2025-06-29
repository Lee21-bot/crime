const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  console.log('Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
  process.exit(1)
}

// Use service role key to bypass RLS and email confirmation
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyAdminUser() {
  console.log('Verifying admin user...')

  try {
    // Get the admin user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error listing users:', userError)
      return
    }

    const adminUser = users.users.find(user => user.email === 'admin@shadowfiles.com')
    
    if (!adminUser) {
      console.error('Admin user not found')
      return
    }

    console.log('Found admin user:', adminUser.id)

    // Update the user to confirm email and set as confirmed
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        email_confirm: true,
        user_metadata: { 
          ...adminUser.user_metadata,
          email_confirmed_at: new Date().toISOString()
        }
      }
    )

    if (updateError) {
      console.error('Error updating admin user:', updateError)
      return
    }

    console.log('✅ Admin user verified successfully!')
    console.log('Email: admin@shadowfiles.com')
    console.log('Password: admin123456')
    console.log('Status: Email confirmed and ready to use')

    // Also create the subscription manually
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: adminUser.id,
        tier: 'investigator',
        status: 'active'
      })

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
    } else {
      console.log('✅ Admin subscription created successfully!')
    }

    console.log('\n🎉 Admin user is now fully verified and ready!')
    console.log('You can sign in at: http://localhost:3000/auth')

  } catch (error) {
    console.error('Error verifying admin user:', error)
  }
}

verifyAdminUser() 