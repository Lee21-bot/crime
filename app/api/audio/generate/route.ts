import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { elevenLabsService, type AudioGenerationOptions } from '../../../../lib/audio/elevenlabs-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has investigator subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .single()

    if (!subscription || subscription.tier !== 'investigator' || subscription.status !== 'active') {
      return NextResponse.json({ error: 'Investigator subscription required' }, { status: 403 })
    }

    const body: AudioGenerationOptions = await request.json()
    const { text, voiceType, stability, similarityBoost, style, useSpeakerBoost } = body

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Limit text length to prevent abuse
    if (text.length > 5000) {
      return NextResponse.json({ error: 'Text too long. Maximum 5000 characters allowed.' }, { status: 400 })
    }

    // Generate audio
    const result = await elevenLabsService.generateAudio({
      text: text.trim(),
      voiceType,
      stability,
      similarityBoost,
      style,
      useSpeakerBoost,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating audio:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    )
  }
} 