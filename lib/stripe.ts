import Stripe from 'stripe'

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

// Stripe price IDs (you'll need to create these in your Stripe dashboard)
export const STRIPE_PRICE_IDS = {
  INVESTIGATOR_MONTHLY: process.env.STRIPE_INVESTIGATOR_PRICE_ID || 'price_investigator_monthly',
  INVESTIGATOR_YEARLY: process.env.STRIPE_INVESTIGATOR_YEARLY_PRICE_ID || 'price_investigator_yearly',
} as const

// Create a customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}

// Create a checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })
  return session
}

// Get or create a Stripe customer
export async function getOrCreateCustomer(userId: string, email: string) {
  // First, try to find existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer if not found
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  return customer
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
} 