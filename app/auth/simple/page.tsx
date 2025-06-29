'use client'

import { useState } from 'react'

export default function SimpleAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-bg-secondary/90 backdrop-blur-sm rounded-lg p-8 border border-border-primary">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Simple Auth Test
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium bg-accent-yellow hover:bg-accent-yellow/80 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 