'use client'

import { useEffect, useState } from 'react'
import { getAuthService } from '../../lib/auth'

export default function TestAuthPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testAuth = async () => {
      try {
        setStatus('Getting auth service...')
        const service = getAuthService()
        
        setStatus('Getting session...')
        const { session, error: sessionError } = await service.getSession()
        
        if (sessionError) {
          setError(`Session error: ${sessionError.message}`)
          setStatus('Error')
          return
        }
        
        if (session) {
          setStatus(`Session found for user: ${session.user.email}`)
        } else {
          setStatus('No session found - this is expected for new users')
        }
      } catch (err) {
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setStatus('Error')
      }
    }

    testAuth()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-bg-secondary/90 backdrop-blur-sm rounded-lg p-8 border border-border-primary max-w-md">
        <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>
          {error && (
            <div className="text-red-500">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 