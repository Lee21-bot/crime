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
  isAdmin: boolean
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
    isAdmin: false,
    loading: true,
  })
  const [authService, setAuthService] = useState<ReturnType<typeof getAuthService> | null>(null)
  const pathname = usePathname();

  // Initialize auth service on component mount
  useEffect(() => {
    console.log('Auth provider initializing...')
    
    const service = getAuthService()
    setAuthService(service)

    // Add a fallback timeout to ensure loading is set to false
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback timeout: setting loading to false')
      setAuthState(prev => ({ 
        ...prev, 
        loading: false 
      }))
    }, 2000)

    const fetchInitialSession = async () => {
      try {
        console.log('Fetching initial session...')
        
        // Simple session fetch
        const { session, error } = await service.getSession()
        
        console.log('Session fetch result:', { session: !!session, error })
        
        if (error) {
          console.error('Error fetching initial session:', error)
          setAuthState(prev => ({ 
            ...prev, 
            user: null,
            session: null,
            loading: false 
          }))
          return
        }
        
        if (session?.user) {
          console.log('User found in session, loading data...')
          setAuthState(prev => ({ 
            ...prev, 
            user: session.user,
            session: session,
            loading: true 
          }))
          await loadUserData(service, session.user.id)
        } else {
          console.log('No session found, setting loading to false')
          setAuthState(prev => ({ 
            ...prev, 
            user: null,
            session: null,
            loading: false 
          }))
        }
      } catch (error) {
        console.error('Error in fetchInitialSession:', error)
        setAuthState(prev => ({ 
          ...prev, 
          user: null,
          session: null,
          loading: false 
        }))
      } finally {
        clearTimeout(fallbackTimeout)
      }
    }

    fetchInitialSession()

    return () => {
      clearTimeout(fallbackTimeout)
    }
  }, [])

  // Centralized function to load user data and update state atomically
  const loadUserData = async (service: ReturnType<typeof getAuthService>, userId: string) => {
    console.log('Loading user data for:', userId)
    setAuthState(prev => ({ ...prev, loading: true }))
    try {
      const [profileResult, subscriptionResult] = await Promise.all([
        service.getUserProfile(userId),
        service.getUserSubscription(userId),
      ])

      console.log('Profile result:', profileResult)
      console.log('Subscription result:', subscriptionResult)

      const userProfile = profileResult?.profile || null
      const userSubscription = subscriptionResult?.subscription || null
      const isInvestigator =
        userSubscription?.tier === 'investigator' && userSubscription?.status === 'active'
      const isAdmin = userProfile?.role === 'admin' || userProfile?.is_admin === true

      console.log('Setting auth state:', { isInvestigator, isAdmin, loading: false })

      setAuthState(prev => ({
        ...prev,
        userProfile,
        userSubscription,
        isInvestigator,
        isAdmin,
        loading: false,
      }))
    } catch (error) {
      console.error('Error loading user data:', error)
      setAuthState(prev => ({
        ...prev,
        userProfile: null,
        userSubscription: null,
        isInvestigator: false,
        isAdmin: false,
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