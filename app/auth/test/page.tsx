'use client'

import { useState } from 'react'

export default function TestPage() {
  const [test, setTest] = useState('Hello World')

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-lg">{test}</p>
      </div>
    </div>
  )
} 