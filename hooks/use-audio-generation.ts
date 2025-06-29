import { useState } from 'react'
import type { AudioGenerationOptions, AudioGenerationResult, VoiceType } from '../lib/audio/elevenlabs-service'

interface UseAudioGenerationReturn {
  generateAudio: (options: AudioGenerationOptions) => Promise<AudioGenerationResult | null>
  isGenerating: boolean
  error: string | null
  clearError: () => void
}

export function useAudioGeneration(): UseAudioGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAudio = async (options: AudioGenerationOptions): Promise<AudioGenerationResult | null> => {
    try {
      setIsGenerating(true)
      setError(null)

      const response = await fetch('/api/audio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio')
      }

      return data as AudioGenerationResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Audio generation error:', err)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    generateAudio,
    isGenerating,
    error,
    clearError,
  }
} 