'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { authService, AuthState } from '../lib/auth'
import { Database } from '../types/database'

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  userProfile: Database['public']['Tables']['user_profiles']['Row'] | null
  userSubscription: Database['public']['Tables']['user_subscriptions']['Row'] | null
  isInvestigator: boolean
  refreshProfile: () => Promise<void>
  refreshSubscription: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  const [userProfile, setUserProfile] = useState<Database['public']['Tables']['user_profiles']['Row'] | null>(null)
  const [userSubscription, setUserSubscription] = useState<Database['public']['Tables']['user_subscriptions']['Row'] | null>(null)

  // Check if user has active investigator subscription
  const isInvestigator = userSubscription?.status === 'active' && userSubscription?.tier === 'investigator'

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await authService.getSession()
      
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false
      })

      if (session?.user) {
        await loadUserData(session.user.id)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false
      })

      if (session?.user) {
        await loadUserData(session.user.id)
      } else {
        // Clear user data on sign out
        setUserProfile(null)
        setUserSubscription(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    // Load user profile
    const { profile } = await authService.getUserProfile(userId)
    setUserProfile(profile)

    // Load user subscription
    const { subscription } = await authService.getUserSubscription(userId)
    setUserSubscription(subscription)
  }

  const refreshProfile = async () => {
    if (authState.user) {
      const { profile } = await authService.getUserProfile(authState.user.id)
      setUserProfile(profile)
    }
  }

  const refreshSubscription = async () => {
    if (authState.user) {
      const { subscription } = await authService.getUserSubscription(authState.user.id)
      setUserSubscription(subscription)
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await authService.signUp({ email, password, displayName })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await authService.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email)
    return { error }
  }

  const value: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    userProfile,
    userSubscription,
    isInvestigator,
    refreshProfile,
    refreshSubscription
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hook for checking if user can access content
export function useCanAccess(requiredTier: 'free' | 'investigator') {
  const { user, isInvestigator } = useAuth()
  
  if (requiredTier === 'free') return true
  if (requiredTier === 'investigator') return user && isInvestigator
  
  return false
} 