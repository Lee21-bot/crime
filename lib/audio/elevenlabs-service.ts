import ElevenLabs from 'elevenlabs-node'

// Initialize ElevenLabs client
const elevenlabs = ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY!,
})

// Voice IDs for different case types
export const VOICE_IDS = {
  NARRATOR: 'pNInz6obpgDQGcFmaJgB', // Adam - Professional narrator
  DETECTIVE: 'VR6AewLTigWG4xSOukaG', // Josh - Detective voice
  REPORTER: 'EXAVITQu4vr4xnSDxMaL', // Bella - News reporter
  WITNESS: '21m00Tcm4TlvDq8ikWAM', // Rachel - Witness voice
} as const

export type VoiceType = keyof typeof VOICE_IDS

export interface AudioGenerationOptions {
  text: string
  voiceType?: VoiceType
  stability?: number // 0-1, default 0.5
  similarityBoost?: number // 0-1, default 0.75
  style?: number // 0-1, default 0
  useSpeakerBoost?: boolean // default true
}

export interface AudioGenerationResult {
  audioUrl: string
  duration: number
  wordCount: number
  voiceUsed: string
}

export class ElevenLabsService {
  /**
   * Generate audio from text using ElevenLabs
   */
  async generateAudio(options: AudioGenerationOptions): Promise<AudioGenerationResult> {
    try {
      const {
        text,
        voiceType = 'NARRATOR',
        stability = 0.5,
        similarityBoost = 0.75,
        style = 0,
        useSpeakerBoost = true,
      } = options

      const voiceId = VOICE_IDS[voiceType]

      // Generate audio using ElevenLabs
      const audioBuffer = await elevenlabs.textToSpeech({
        text,
        voice_id: voiceId,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: useSpeakerBoost,
        },
      })

      // Convert buffer to base64 for storage/transmission
      const base64Audio = audioBuffer.toString('base64')
      const audioUrl = `data:audio/mpeg;base64,${base64Audio}`

      // Estimate duration (rough calculation: ~150 words per minute)
      const wordCount = text.split(/\s+/).length
      const estimatedDuration = (wordCount / 150) * 60 // seconds

      return {
        audioUrl,
        duration: estimatedDuration,
        wordCount,
        voiceUsed: voiceType,
      }
    } catch (error) {
      console.error('Error generating audio:', error)
      throw new Error('Failed to generate audio narration')
    }
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getAvailableVoices() {
    try {
      const voices = await elevenlabs.voices.getAll()
      return voices
    } catch (error) {
      console.error('Error fetching voices:', error)
      throw new Error('Failed to fetch available voices')
    }
  }

  /**
   * Get voice details by ID
   */
  async getVoiceDetails(voiceId: string) {
    try {
      const voice = await elevenlabs.voices.get(voiceId)
      return voice
    } catch (error) {
      console.error('Error fetching voice details:', error)
      throw new Error('Failed to fetch voice details')
    }
  }

  /**
   * Determine the best voice type for a case file based on content
   */
  getVoiceTypeForCase(content: string, difficulty: string): VoiceType {
    // Analyze content to determine appropriate voice
    const lowerContent = content.toLowerCase()
    
    // If content contains witness statements or interviews
    if (lowerContent.includes('witness') || lowerContent.includes('interview') || lowerContent.includes('testimony')) {
      return 'WITNESS'
    }
    
    // If content is more investigative/reporting style
    if (lowerContent.includes('investigation') || lowerContent.includes('evidence') || lowerContent.includes('forensic')) {
      return 'DETECTIVE'
    }
    
    // If content is news-style reporting
    if (lowerContent.includes('reported') || lowerContent.includes('announced') || lowerContent.includes('according to')) {
      return 'REPORTER'
    }
    
    // Default to narrator for general case files
    return 'NARRATOR'
  }

  /**
   * Split long text into chunks for better audio generation
   */
  splitTextIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
    const chunks: string[] = []
    let currentChunk = ''

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (currentChunk.length + trimmedSentence.length > maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
          currentChunk = trimmedSentence
        } else {
          // If a single sentence is too long, split it by words
          const words = trimmedSentence.split(' ')
          let wordChunk = ''
          for (const word of words) {
            if (wordChunk.length + word.length > maxChunkSize) {
              if (wordChunk) {
                chunks.push(wordChunk.trim())
                wordChunk = word
              } else {
                chunks.push(word)
              }
            } else {
              wordChunk += (wordChunk ? ' ' : '') + word
            }
          }
          if (wordChunk) {
            currentChunk = wordChunk
          }
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService() 