'use client'

import { useState, useEffect } from 'react'

export default function SimpleAuthPage() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const test = async () => {
      try {
        setMessage('Testing auth...')
        
        // Test if we can access environment variables
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!url || !key) {
          setMessage('Missing environment variables')
          setLoading(false)
          return
        }
        
        setMessage('Environment variables found, testing Supabase...')
        
        // Test Supabase client creation
        const { createClient } = await import('../../lib/supabase/client')
        const supabase = createClient()
        
        setMessage('Supabase client created, testing session...')
        
        // Test session fetch
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setMessage(`Session error: ${error.message}`)
        } else if (data.session) {
          setMessage(`Session found for: ${data.session.user.email}`)
        } else {
          setMessage('No session found - this is expected')
        }
        
        setLoading(false)
      } catch (err) {
        setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setLoading(false)
      }
    }

    test()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-bg-secondary/90 backdrop-blur-sm rounded-lg p-8 border border-border-primary max-w-md">
        <h1 className="text-2xl font-bold mb-4">Simple Auth Test</h1>
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {loading ? 'Loading...' : 'Complete'}
          </div>
          <div>
            <strong>Message:</strong> {message}
          </div>
        </div>
      </div>
    </div>
  )
} 