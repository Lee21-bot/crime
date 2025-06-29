'use client'

import { createClient } from './supabase/client'
import { AuthError, Session, User, AuthChangeEvent } from '@supabase/supabase-js'

// Get the single Supabase client instance
const supabase = createClient()

export interface SignUpData {
  email: string
  password: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}

// Re-export the Supabase client for other parts of the app to use
export const authSupabase = supabase

export const getAuthService = () => {
  if (typeof window === 'undefined') {
    // This is a simple guard. The functions below should only be called on the client.
    console.warn('AuthService is being accessed in a non-browser environment.')
    // Return a mock object or throw an error if you want to be stricter
    return {
      signUp: async () => ({ user: null, session: null, error: new Error('Cannot sign up on the server') }),
      signIn: async () => ({ user: null, session: null, error: new Error('Cannot sign in on the server') }),
      signOut: async () => ({ error: null }),
      resetPassword: async () => ({ error: null }),
      updatePassword: async () => ({ error: null }),
      getSession: async () => ({ session: null, error: null }),
      getUser: async () => ({ user: null, error: null }),
      getUserProfile: async () => ({ profile: null, error: new Error('Cannot get profile on the server') }),
      updateUserProfile: async () => ({ profile: null, error: new Error('Cannot update profile on the server') }),
      getUserSubscription: async () => ({ subscription: null, error: new Error('Cannot get subscription on the server') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    }
  }

  // --- Core Auth Functions ---

  const signUp = async ({ email, password, displayName }: SignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (data.user) {
      await createUserProfile(data.user.id, {
        display_name: displayName || email.split('@')[0],
      })
    }
    return { user: data.user, session: data.session, error }
  }

  const signIn = async ({ email, password }: SignInData) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { user: data.user, session: data.session, error }
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
  }
  
  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword })
  }

  // --- Session and User Data ---

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    return { session: data.session, error }
  }

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    return { user: data.user, error }
  }

  // --- Profile and Subscription Data ---

  const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from('user_profiles').select('*').eq('user_id', userId).single()
    return { profile: data, error }
  }

  const updateUserProfile = async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()
    return { profile: data, error }
  }

  const getUserSubscription = async (userId: string) => {
    const { data, error } = await supabase.from('user_subscriptions').select('*').eq('user_id', userId).single()
    return { subscription: data, error }
  }

  const createUserProfile = async (userId: string, profileData: { display_name: string }) => {
    const { error } = await supabase.from('user_profiles').insert({ user_id: userId, ...profileData })
    return { error }
  }
  
  const onAuthStateChange = (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    try {
      return supabase.auth.onAuthStateChange(callback)
    } catch (error) {
      console.warn('Failed to create auth state change subscription:', error)
      // Return a dummy subscription that can be unsubscribed
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    }
  }

  // --- Export all functions ---

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    getSession,
    getUser,
    getUserProfile,
    updateUserProfile,
    getUserSubscription,
    onAuthStateChange,
  }
} 