import { createClient } from '../../../lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/error', request.url))
}

export async function POST(request: NextRequest) {
  const { email, token, type } = await request.json()

  if (email && token) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: type as any,
    })

    if (!error) {
      return NextResponse.json({ message: 'Email confirmed' })
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
} 