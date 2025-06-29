// Client-side Stripe configuration (safe for browser)
export const STRIPE_PRICE_IDS = {
  INVESTIGATOR_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_INVESTIGATOR_PRICE_ID || 'price_investigator_monthly',
  INVESTIGATOR_YEARLY: process.env.NEXT_PUBLIC_STRIPE_INVESTIGATOR_YEARLY_PRICE_ID || 'price_investigator_yearly',
} as const 