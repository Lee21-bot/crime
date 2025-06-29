declare module 'elevenlabs-node' {
  export interface VoiceSettings {
    stability?: number
    similarity_boost?: number
    style?: number
    use_speaker_boost?: boolean
  }

  export interface TextToSpeechOptions {
    text: string
    voice_id: string
    model_id?: string
    voice_settings?: VoiceSettings
  }

  export interface Voice {
    voice_id: string
    name: string
    samples?: any[]
    category: string
    fine_tuning?: any
    labels?: Record<string, string>
    description?: string
    preview_url?: string
    available_for_tiers?: string[]
    settings?: any
    sharing?: any
    high_quality_base_model_ids?: string[]
    safety_control?: string
    safety_label?: string
    voice_verification?: any
  }

  interface ElevenLabsInstance {
    textToSpeech(options: TextToSpeechOptions): Promise<Buffer>
    
    voices: {
      getAll(): Promise<Voice[]>
      get(voiceId: string): Promise<Voice>
    }
  }

  function ElevenLabs(config: { apiKey: string }): ElevenLabsInstance
  
  export default ElevenLabs
} 