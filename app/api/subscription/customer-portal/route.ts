import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { createCustomerPortalSession } from '../../../../lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's subscription to find Stripe customer ID
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription?.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const { returnUrl } = await request.json()

    // Create customer portal session
    const session = await createCustomerPortalSession(
      subscription.stripe_customer_id,
      returnUrl || `${process.env.NEXTAUTH_URL}/membership`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
} 