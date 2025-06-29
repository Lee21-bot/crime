import { createClient } from '../supabase/server'
import { ElevenLabsService, VoiceType } from '../audio/elevenlabs-service'

export interface AudioStory {
  id: string
  title: string
  description?: string
  content: string
  audio_url: string
  duration_seconds: number
  voice_type: string
  status: 'draft' | 'published' | 'archived'
  author?: string
  tags?: string[]
  created_at: string
  updated_at: string
  published_at?: string
  created_by?: string
  play_count: number
  is_featured: boolean
}

export interface CreateAudioStoryData {
  title: string
  description?: string
  content: string
  voice_type?: VoiceType
  author?: string
  tags?: string[]
  is_featured?: boolean
}

export interface UpdateAudioStoryData {
  title?: string
  description?: string
  content?: string
  voice_type?: VoiceType
  status?: 'draft' | 'published' | 'archived'
  author?: string
  tags?: string[]
  is_featured?: boolean
}

export class AudioStoriesService {
  private elevenLabs = new ElevenLabsService()

  /**
   * Create a new audio story and generate audio
   */
  async createStory(data: CreateAudioStoryData): Promise<AudioStory> {
    try {
      const supabase = await createClient()

      // Generate audio using ElevenLabs
      const audioResult = await this.elevenLabs.generateAudio({
        text: data.content,
        voiceType: data.voice_type || 'NARRATOR'
      })

      // Calculate duration (approximate)
      const durationSeconds = Math.ceil(data.content.length / 15) // Rough estimate: 15 chars per second

      // Insert into database
      const { data: story, error } = await supabase
        .from('audio_stories')
        .insert({
          title: data.title,
          description: data.description,
          content: data.content,
          audio_url: audioResult.audioUrl,
          duration_seconds: durationSeconds,
          voice_type: data.voice_type || 'NARRATOR',
          author: data.author,
          tags: data.tags || [],
          is_featured: data.is_featured || false,
          status: 'draft'
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return story
    } catch (error) {
      console.error('Error creating audio story:', error)
      throw error
    }
  }

  /**
   * Get all published audio stories for investigators
   */
  async getPublishedStories(): Promise<AudioStory[]> {
    try {
      const supabase = await createClient()

      const { data: stories, error } = await supabase
        .from('audio_stories')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return stories || []
    } catch (error) {
      console.error('Error fetching published stories:', error)
      throw error
    }
  }

  /**
   * Get all audio stories (admin only)
   */
  async getAllStories(): Promise<AudioStory[]> {
    try {
      const supabase = await createClient()

      const { data: stories, error } = await supabase
        .from('audio_stories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return stories || []
    } catch (error) {
      console.error('Error fetching all stories:', error)
      throw error
    }
  }

  /**
   * Get a single audio story by ID
   */
  async getStoryById(id: string): Promise<AudioStory | null> {
    try {
      const supabase = await createClient()

      const { data: story, error } = await supabase
        .from('audio_stories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return story
    } catch (error) {
      console.error('Error fetching story:', error)
      throw error
    }
  }

  /**
   * Update an audio story
   */
  async updateStory(id: string, data: UpdateAudioStoryData): Promise<AudioStory> {
    try {
      const supabase = await createClient()

      // If content changed, regenerate audio
      let audioUrl: string | undefined
      let durationSeconds: number | undefined

      if (data.content) {
        const story = await this.getStoryById(id)
        if (story && story.content !== data.content) {
          const audioResult = await this.elevenLabs.generateAudio({
            text: data.content,
            voiceType: data.voice_type || (story.voice_type as VoiceType)
          })

          audioUrl = audioResult.audioUrl
          durationSeconds = Math.ceil(data.content.length / 15)
        }
      }

      // Update database
      const updateData: any = { ...data }
      if (audioUrl) updateData.audio_url = audioUrl
      if (durationSeconds) updateData.duration_seconds = durationSeconds

      const { data: story, error } = await supabase
        .from('audio_stories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return story
    } catch (error) {
      console.error('Error updating story:', error)
      throw error
    }
  }

  /**
   * Delete an audio story
   */
  async deleteStory(id: string): Promise<void> {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from('audio_stories')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      throw error
    }
  }

  /**
   * Record a play event
   */
  async recordPlay(storyId: string, durationPlayed?: number, completed?: boolean): Promise<void> {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from('audio_story_plays')
        .insert({
          story_id: storyId,
          duration_played: durationPlayed,
          completed: completed || false
        })

      if (error) {
        console.error('Error recording play:', error)
        // Don't throw error for play tracking failures
      }

      // Update play count
      const story = await this.getStoryById(storyId)
      await supabase
        .from('audio_stories')
        .update({ play_count: (story?.play_count || 0) + 1 })
        .eq('id', storyId)
    } catch (error) {
      console.error('Error recording play:', error)
      // Don't throw error for play tracking failures
    }
  }

  /**
   * Search stories by title, description, or tags
   */
  async searchStories(query: string, voiceType?: string): Promise<AudioStory[]> {
    try {
      const supabase = await createClient()

      let queryBuilder = supabase
        .from('audio_stories')
        .select('*')
        .eq('status', 'published')

      // Add search filter
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%`
        )
      }

      // Add voice type filter
      if (voiceType && voiceType !== 'all') {
        queryBuilder = queryBuilder.eq('voice_type', voiceType)
      }

      const { data: stories, error } = await queryBuilder
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return stories || []
    } catch (error) {
      console.error('Error searching stories:', error)
      throw error
    }
  }

  /**
   * Get featured stories
   */
  async getFeaturedStories(limit: number = 3): Promise<AudioStory[]> {
    try {
      const supabase = await createClient()

      const { data: stories, error } = await supabase
        .from('audio_stories')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return stories || []
    } catch (error) {
      console.error('Error fetching featured stories:', error)
      throw error
    }
  }
} 