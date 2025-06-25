import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // For now, we'll implement basic route protection
  // This will be enhanced when we add Supabase authentication

  // Protect chat routes - requires paid membership
  if (req.nextUrl.pathname.startsWith('/chat')) {
    // Redirect to membership page if accessing chat without authentication
    return NextResponse.redirect(new URL('/membership', req.url))
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Redirect to home if accessing admin without proper permissions
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Protect premium case file content
  if (req.nextUrl.pathname.startsWith('/case-files/') && 
      req.nextUrl.searchParams.get('premium') === 'true') {
    // Redirect to membership page for premium content
    return NextResponse.redirect(new URL('/membership?upgrade=premium', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/chat/:path*', 
    '/case-files/:path*', 
    '/admin/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
} 