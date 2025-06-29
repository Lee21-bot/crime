import { useState } from 'react'

interface CheckoutOptions {
  priceId: string
  successUrl?: string
  cancelUrl?: string
}

interface CustomerPortalOptions {
  returnUrl?: string
}

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCheckoutSession = async (options: CheckoutOptions) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async (options: CustomerPortalOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscription/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open customer portal')
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No portal URL received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Customer portal error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    createCheckoutSession,
    openCustomerPortal,
    loading,
    error,
  }
} 