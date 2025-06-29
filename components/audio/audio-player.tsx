'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Loader2 } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
  title?: string
  duration?: number
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  className?: string
}

export function AudioPlayer({ 
  audioUrl, 
  title = 'Audio Narration',
  duration: initialDuration,
  onPlay,
  onPause,
  onEnded,
  className = ''
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(initialDuration || 0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      audioRef.current.play()
      setIsPlaying(true)
      onPlay?.()
    }
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  // Handle mute/unmute
  const toggleMute = () => {
    if (!audioRef.current) return
    
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * audioDuration
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle skip forward/backward
  const skip = (seconds: number) => {
    if (!audioRef.current) return
    
    const newTime = Math.max(0, Math.min(audioDuration, currentTime + seconds))
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onEnded?.()
    }

    const handleError = () => {
      setError('Failed to load audio')
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
    }
  }, [onEnded])

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  return (
    <div className={`bg-bg-tertiary/80 backdrop-blur-sm border border-border-primary rounded-lg p-4 ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {isLoading && (
          <Loader2 className="w-5 h-5 text-accent-yellow animate-spin" />
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 p-2 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div 
          ref={progressRef}
          className="relative h-2 bg-bg-secondary rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-accent-yellow rounded-full transition-all duration-100"
            style={{ width: `${audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(audioDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Skip backward */}
          <button
            onClick={() => skip(-10)}
            className="p-2 text-text-secondary hover:text-accent-yellow transition-colors"
            title="Skip 10 seconds back"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={isLoading || !!error}
            className="p-3 bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Skip forward */}
          <button
            onClick={() => skip(10)}
            className="p-2 text-text-secondary hover:text-accent-yellow transition-colors"
            title="Skip 10 seconds forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 text-text-secondary hover:text-accent-yellow transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-bg-secondary rounded-lg appearance-none cursor-pointer slider"
            title="Volume"
          />
        </div>
      </div>
    </div>
  )
} 