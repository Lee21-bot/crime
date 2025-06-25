import { createClient } from './supabase'
import { AuthError, Session, User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export interface SignUpData {
  email: string
  password: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}

class AuthService {
  private supabase = createClient()

  async signUp({ email, password, displayName }: SignUpData) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          }
        }
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user.id, {
          display_name: displayName || email.split('@')[0],
          email: data.user.email || email
        })
      }

      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      return { user: null, session: null, error: error as AuthError }
    }
  }

  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      return { user: null, session: null, error: error as AuthError }
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession()
      if (error) throw error
      return { session: data.session, error: null }
    } catch (error) {
      return { session: null, error: error as AuthError }
    }
  }

  async getUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser()
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }

  async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error }
    }
  }

  async updateUserProfile(userId: string, updates: {
    display_name?: string
    avatar_url?: string
    bio?: string
  }) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error }
    }
  }

  async getUserSubscription(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      return { subscription: data, error }
    } catch (error) {
      return { subscription: null, error }
    }
  }

  private async createUserProfile(userId: string, profileData: {
    display_name: string
    email: string
  }) {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          display_name: profileData.display_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session)
    })
  }
}

export const authService = new AuthService() 