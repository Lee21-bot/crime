'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useAuth } from '../../providers/auth-provider'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
  onClose?: () => void
}

export function AuthForms({ mode, onToggleMode, onClose }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return // Prevent multiple submissions

    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password, displayName)
        if (error) throw error
      }

      // Only call onClose if no error occurred and it exists
      if (onClose) {
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-bg-secondary/90 backdrop-blur-sm rounded-lg p-8 border border-border-primary">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">
            {mode === 'signin' ? 'Join the Investigation' : 'Become an Investigator'}
          </h2>
          <p className="text-text-muted">
            {mode === 'signin' 
              ? 'Sign in to access exclusive case files and member chat'
              : 'Create your account to start investigating mysteries'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-accent-red/20 border border-accent-red/50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent-red" />
            <span className="text-accent-red text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 bg-bg-tertiary/60 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                placeholder="Enter your display name"
                disabled={isSubmitting}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-bg-tertiary/60 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow"
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-bg-tertiary/60 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow"
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-accent-yellow/50 cursor-not-allowed'
                : 'bg-accent-yellow hover:bg-accent-yellow/80'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={onToggleMode}
            disabled={isSubmitting}
            className="text-accent-yellow hover:text-accent-yellow/80 transition-colors"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
} 