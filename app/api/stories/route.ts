import { NextRequest, NextResponse } from 'next/server'
import { AudioStoriesService } from '../../../lib/audio-stories/audio-stories-service'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const showAll = url.searchParams.get('all') === '1'

    if (showAll) {
      // Check if user is admin
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single()
      if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const audioStoriesService = new AudioStoriesService()
      const stories = await audioStoriesService.getAllStories()
      return NextResponse.json({ stories })
    } else {
      const audioStoriesService = new AudioStoriesService()
      const stories = await audioStoriesService.getPublishedStories()
      return NextResponse.json({ stories })
    }
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
} 