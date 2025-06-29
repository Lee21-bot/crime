'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { getAuthService } from '../lib/auth'
import { Database } from '../types/database'
import { usePathname } from 'next/navigation'

// Consolidate all auth-related state into a single object for atomic updates
interface AuthState {
  user: User | null
  session: Session | null
  userProfile: Database['public']['Tables']['user_profiles']['Row'] | null
  userSubscription: Database['public']['Tables']['user_subscriptions']['Row'] | null
  isInvestigator: boolean
  loading: boolean
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userProfile: null,
    userSubscription: null,
    isInvestigator: false,
    loading: true,
  })
  const [authService, setAuthService] = useState<ReturnType<typeof getAuthService> | null>(null)
  const pathname = usePathname();

  // Initialize auth service on component mount
  useEffect(() => {
    const service = getAuthService()
    setAuthService(service)

    const fetchInitialSession = async () => {
      const { session } = await service.getSession()
      if (session?.user) {
        await loadUserData(service, session.user.id)
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }

    fetchInitialSession()
  }, [])

  // Centralized function to load user data and update state atomically
  const loadUserData = async (service: ReturnType<typeof getAuthService>, userId: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    try {
      const [profileResult, subscriptionResult] = await Promise.all([
        service.getUserProfile(userId),
        service.getUserSubscription(userId),
      ])

      const userProfile = profileResult?.profile || null
      const userSubscription = subscriptionResult?.subscription || null
      const isInvestigator =
        userSubscription?.tier === 'investigator' && userSubscription?.status === 'active'

      setAuthState(prev => ({
        ...prev,
        userProfile,
        userSubscription,
        isInvestigator,
        loading: false,
      }))
    } catch (error) {
      console.error('Error loading user data:', error)
      setAuthState(prev => ({
        ...prev,
        userProfile: null,
        userSubscription: null,
        isInvestigator: false,
        loading: false,
      }))
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    if (!authService) return

    const { data: { subscription } } = authService.onAuthStateChange(async (_event, session) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session: session ?? null,
      }))
      if (session?.user) {
        await loadUserData(authService, session.user.id)
      } else {
        // Clear user-specific data on logout
        setAuthState(prev => ({
          ...prev,
          userProfile: null,
          userSubscription: null,
          isInvestigator: false,
          loading: false
        }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [authService])

  // Refresh session on route change
  useEffect(() => {
    if (!authService) return;
    const refresh = async () => {
      if (authState.user) {
        await loadUserData(authService, authState.user.id);
      } else {
        const { session } = await authService.getSession();
        if (session?.user) {
          await loadUserData(authService, session.user.id);
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, authService]);

  const refreshUserData = useCallback(async () => {
    if (authService && authState.user) {
      await loadUserData(authService, authState.user.id)
    }
  }, [authService, authState.user])

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!authService) return { error: new Error('Auth service not initialized') }
    return await authService.signUp({ email, password, displayName })
  }

  const signIn = async (email: string, password: string) => {
    if (!authService) return { error: new Error('Auth service not initialized') }
    return await authService.signIn({ email, password })
  }

  const signOut = async () => {
    if (!authService) return { error: new Error('Auth service not initialized') }
    return await authService.signOut()
  }

  const resetPassword = async (email: string) => {
    if (!authService) return { error: new Error('Auth service not initialized') }
    return await authService.resetPassword(email)
  }

  const value = {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useCanAccess(requiredTier: 'free' | 'investigator') {
  const { isInvestigator, loading } = useAuth()

  if (loading) {
    return false
  }

  if (requiredTier === 'investigator' && !isInvestigator) {
    return false
  }

  return true
} 