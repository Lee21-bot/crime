export default function AuthLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Loading</h1>
        <p className="text-text-secondary text-lg mb-8">
          Please wait while we process your request...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-red"></div>
        </div>
      </div>
    </div>
  )
} 