import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../../lib/stripe'
import { createClient } from '../../../../lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as any
        await handleSubscriptionUpdate(supabase, subscription)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as any
        await handleSubscriptionCancellation(supabase, deletedSubscription)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as any
        await handlePaymentSucceeded(supabase, invoice)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as any
        await handlePaymentFailed(supabase, failedInvoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionUpdate(supabase: any, subscription: any) {
  const customerId = subscription.customer
  const subscriptionId = subscription.id
  const status = subscription.status
  const priceId = subscription.items.data[0]?.price.id

  // Determine tier based on price ID
  let tier = 'free'
  if (priceId?.includes('investigator')) {
    tier = 'investigator'
  }

  // Get user by customer ID
  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (userSub) {
    // Update existing subscription
    await supabase
      .from('user_subscriptions')
      .update({
        stripe_subscription_id: subscriptionId,
        status: status,
        tier: tier,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userSub.user_id)
  } else {
    // Create new subscription record
    await supabase
      .from('user_subscriptions')
      .insert({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: status,
        tier: tier,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
  }
}

async function handleSubscriptionCancellation(supabase: any, subscription: any) {
  const customerId = subscription.customer

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)
}

async function handlePaymentSucceeded(supabase: any, invoice: any) {
  const customerId = invoice.customer

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)
}

async function handlePaymentFailed(supabase: any, invoice: any) {
  const customerId = invoice.customer

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)
} 