'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Loading...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testSupabase = async () => {
      try {
        const supabase = createClient()
        
        // Test basic connection
        const { data, error } = await supabase.from('case_files').select('count').limit(1)
        
        if (error) {
          setError(error.message)
          setStatus('Error')
        } else {
          setStatus('Connected successfully')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('Error')
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Supabase Test</h1>
        <p className="text-lg mb-2">Status: {status}</p>
        {error && (
          <p className="text-red-500">Error: {error}</p>
        )}
      </div>
    </div>
  )
} 