import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { createCheckoutSession, getOrCreateCustomer, STRIPE_PRICE_IDS } from '../../../../lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId, successUrl, cancelUrl } = await request.json()

    // Validate price ID
    const validPriceIds = Object.values(STRIPE_PRICE_IDS)
    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(user.id, user.email!)

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      successUrl: successUrl || `${process.env.NEXTAUTH_URL}/membership?success=true`,
      cancelUrl: cancelUrl || `${process.env.NEXTAUTH_URL}/membership?canceled=true`,
      metadata: {
        userId: user.id,
        userEmail: user.email!,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 