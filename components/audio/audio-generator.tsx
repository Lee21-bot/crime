'use client'

import React, { useState } from 'react'
import { Volume2, Play, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useAudioGeneration } from '../../hooks/use-audio-generation'
import { AudioPlayer } from './audio-player'
import type { VoiceType } from '../../lib/audio/elevenlabs-service'

interface AudioGeneratorProps {
  text: string
  title?: string
  voiceType?: VoiceType
  onAudioGenerated?: (audioUrl: string) => void
  className?: string
}

const VOICE_OPTIONS = [
  { value: 'NARRATOR', label: 'Professional Narrator', description: 'Clear, authoritative voice for general narration' },
  { value: 'DETECTIVE', label: 'Detective Voice', description: 'Gritty, investigative tone for crime cases' },
  { value: 'REPORTER', label: 'News Reporter', description: 'Clear, journalistic style for reporting' },
  { value: 'WITNESS', label: 'Witness Voice', description: 'Personal, emotional tone for testimonies' },
] as const

export function AudioGenerator({ 
  text, 
  title = 'Case File Narration',
  voiceType: initialVoiceType = 'NARRATOR',
  onAudioGenerated,
  className = ''
}: AudioGeneratorProps) {
  const [selectedVoice, setSelectedVoice] = useState<VoiceType>(initialVoiceType)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [showVoiceOptions, setShowVoiceOptions] = useState(false)
  
  const { generateAudio, isGenerating, error, clearError } = useAudioGeneration()

  const handleGenerateAudio = async () => {
    if (!text.trim()) return

    const result = await generateAudio({
      text: text.trim(),
      voiceType: selectedVoice,
    })

    if (result) {
      setGeneratedAudio(result.audioUrl)
      onAudioGenerated?.(result.audioUrl)
    }
  }

  const handleVoiceChange = (voice: VoiceType) => {
    setSelectedVoice(voice)
    setShowVoiceOptions(false)
    // Clear previous audio when voice changes
    setGeneratedAudio(null)
  }

  const selectedVoiceOption = VOICE_OPTIONS.find(option => option.value === selectedVoice)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Selection */}
      <div className="bg-bg-tertiary/60 backdrop-blur-sm border border-border-primary rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">Audio Narration</h3>
          <button
            onClick={() => setShowVoiceOptions(!showVoiceOptions)}
            className="text-sm text-accent-yellow hover:text-accent-yellow/80 transition-colors"
          >
            {showVoiceOptions ? 'Hide' : 'Change'} Voice
          </button>
        </div>

        {/* Current Voice Display */}
        <div className="flex items-center gap-3 mb-3">
          <Volume2 className="w-5 h-5 text-accent-yellow" />
          <div>
            <p className="text-text-primary font-medium">{selectedVoiceOption?.label}</p>
            <p className="text-text-muted text-sm">{selectedVoiceOption?.description}</p>
          </div>
        </div>

        {/* Voice Options Dropdown */}
        {showVoiceOptions && (
          <div className="mt-3 p-3 bg-bg-secondary/50 rounded-lg border border-border-primary">
            <p className="text-sm text-text-muted mb-2">Select a voice for narration:</p>
            <div className="space-y-2">
              {VOICE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleVoiceChange(option.value as VoiceType)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedVoice === option.value
                      ? 'bg-accent-yellow/20 border border-accent-yellow text-accent-yellow'
                      : 'hover:bg-bg-secondary/80 text-text-secondary'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-75">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerateAudio}
          disabled={isGenerating || !text.trim()}
          className="w-full bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Audio...
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              Generate Audio Narration
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 font-medium">Generation Failed</p>
              <p className="text-red-200 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 text-sm mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {generatedAudio && !isGenerating && (
          <div className="mt-3 p-3 bg-green-900/20 border border-green-500 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-300 font-medium">Audio Generated Successfully</p>
              <p className="text-green-200 text-sm">Your case file narration is ready to play.</p>
            </div>
          </div>
        )}
      </div>

      {/* Audio Player */}
      {generatedAudio && (
        <AudioPlayer
          audioUrl={generatedAudio}
          title={title}
          className="mt-4"
        />
      )}

      {/* Text Preview */}
      {text && (
        <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-4">
          <h4 className="text-sm font-medium text-text-primary mb-2">Text to Narrate:</h4>
          <div className="text-sm text-text-muted max-h-32 overflow-y-auto">
            {text.length > 300 ? `${text.substring(0, 300)}...` : text}
          </div>
          <p className="text-xs text-text-muted mt-2">
            {text.split(/\s+/).length} words • ~{Math.ceil(text.split(/\s+/).length / 150)} minutes
          </p>
        </div>
      )}
    </div>
  )
} 