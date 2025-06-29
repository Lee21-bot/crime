import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { elevenLabsService } from '../../../../lib/audio/elevenlabs-service'
import { AudioStoriesService } from '../../../../lib/audio-stories/audio-stories-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('User from supabase.auth.getUser():', user)
    if (authError) {
      console.log('Auth error:', authError)
    }
    
    if (authError || !user) {
      console.log('Unauthorized: No user or auth error')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()
    console.log('Profile lookup result:', profile)
    if (profileError) {
      console.log('Profile error:', profileError)
    }

    if (!profile?.is_admin) {
      console.log('Forbidden: User is not admin')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      content,
      audioFileUrl,
      coverImageUrl,
      sources,
      voiceType = 'NARRATOR',
      scheduledAt,
      status = 'draft'
    } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    // Validate that either content (for generation) or audioFileUrl is provided
    if (!content && !audioFileUrl) {
      return NextResponse.json({ error: 'Either content (for generation) or audio file URL is required' }, { status: 400 })
    }

    const audioStoriesService = new AudioStoriesService()

    let audioUrl: string
    let durationSeconds: number

    if (audioFileUrl) {
      // Use uploaded audio file
      audioUrl = audioFileUrl
      durationSeconds = 0 // Will be calculated later or set by admin
    } else {
      // Generate audio from content
      const audioResult = await elevenLabsService.generateAudio({
        text: content,
        voiceType: voiceType as any
      })
      audioUrl = audioResult.audioUrl
      durationSeconds = Math.ceil(audioResult.duration)
    }

    // Insert into database
    const { data: episode, error } = await supabase
      .from('audio_stories')
      .insert({
        title,
        description,
        content: content || '',
        audio_url: audioUrl,
        duration_seconds: durationSeconds,
        voice_type: voiceType,
        sources,
        status,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        author: user.id,
        tags: [],
        is_featured: false,
        play_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 })
    }

    return NextResponse.json({ episode })

  } catch (error) {
    console.error('Episode creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create episode' },
      { status: 500 }
    )
  }
} 