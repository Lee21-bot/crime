'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthForms } from '../../components/auth/auth-forms'
import { useAuth } from '../../providers/auth-provider'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-accent-yellow hover:text-accent-yellow/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Auth Forms */}
        <div className="flex justify-center">
          <AuthForms 
            mode={mode} 
            onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            onClose={() => router.push('/dashboard')}
          />
        </div>

        {/* Additional Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
              <h3 className="text-xl font-semibold mb-4 text-accent-yellow">
                Free Membership
              </h3>
              <ul className="space-y-2 text-text-muted">
                <li>• Browse public case files</li>
                <li>• Read case summaries</li>
                <li>• View featured cases</li>
                <li>• Community discussion access</li>
              </ul>
            </div>

            <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-accent-yellow">
              <h3 className="text-xl font-semibold mb-4 text-accent-yellow">
                Investigator Membership ($5/month)
              </h3>
              <ul className="space-y-2 text-text-muted">
                <li>• All free features included</li>
                <li>• Access to member-only chat</li>
                <li>• Full case files with details</li>
                <li>• Audio narration of cases</li>
                <li>• Download case file PDFs</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 