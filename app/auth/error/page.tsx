'use client'

import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Authentication Error</h1>
        <p className="text-text-secondary text-lg mb-8">
          There was an error processing your authentication request. Please try again.
        </p>
        <Link
          href="/auth"
          className="inline-block bg-accent-red hover:bg-accent-red/80 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  )
} 