'use client'

export default function MinimalAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-bg-secondary/90 backdrop-blur-sm rounded-lg p-8 border border-border-primary max-w-md">
        <h1 className="text-2xl font-bold mb-4">Minimal Auth Test</h1>
        <p>This is a minimal auth page to test if the issue is with the auth page itself.</p>
        <p className="mt-4 text-green-500">If you can see this, the auth page is working!</p>
      </div>
    </div>
  )
} 