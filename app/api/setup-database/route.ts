import { NextRequest, NextResponse } from 'next/server'
import { setupDatabase } from '../../../lib/case-files/setup-database'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (you can add more security here)
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    
    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await setupDatabase()
    
    if (result.success) {
      return NextResponse.json({ 
        message: 'Database setup completed successfully',
        success: true 
      })
    } else {
      return NextResponse.json({ 
        error: 'Database setup failed',
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Setup endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 