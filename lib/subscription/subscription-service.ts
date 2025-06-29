import { createClient } from '../supabase/client'

export type SubscriptionTier = 'free' | 'investigator' | 'detective'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'incomplete'

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  created_at: string
  updated_at: string
  expires_at: string | null
}

export class SubscriptionService {
  private supabase = createClient()

  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }

    return data
  }

  async isInvestigator(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId)
    return subscription?.tier === 'investigator' && subscription?.status === 'active'
  }

  async isDetective(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId)
    return subscription?.tier === 'detective' && subscription?.status === 'active'
  }

  async createSubscription(userId: string, customerId: string, subscriptionId: string, tier: SubscriptionTier) {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        tier: tier,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      throw error
    }

    return data
  }

  async updateSubscriptionStatus(userId: string, status: SubscriptionStatus) {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription status:', error)
      throw error
    }

    return data
  }

  async cancelSubscription(userId: string) {
    return await this.updateSubscriptionStatus(userId, 'cancelled')
  }
} 