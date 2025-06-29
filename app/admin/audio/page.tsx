'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../providers/auth-provider'
import { AudioGenerator } from '../../../components/audio/audio-generator'
import { AudioPlayer } from '../../../components/audio/audio-player'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { 
  Volume2, 
  Save, 
  Trash2, 
  Edit, 
  Plus, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface AudioEpisode {
  id: string
  title: string
  description: string
  caseFileId?: string
  audioUrl: string
  duration: number
  voiceType: string
  createdAt: string
  status: 'draft' | 'published'
}

export default function AdminAudioPage() {
  const { user, isAdmin } = useAuth()
  const [episodes, setEpisodes] = useState<AudioEpisode[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<AudioEpisode | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    description: '',
    content: '',
    voiceType: 'NARRATOR' as const
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{audio?: number, image?: number}>({})
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [sources, setSources] = useState('')

  // Check admin access
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8">Admin access required to manage audio episodes.</p>
      </div>
    )
  }

  const handleCreateEpisode = () => {
    setIsCreating(true)
    setSelectedEpisode(null)
    setNewEpisode({
      title: '',
      description: '',
      content: '',
      voiceType: 'NARRATOR'
    })
  }

  const handleSaveEpisode = async (audioUrl: string) => {
    if (!newEpisode.title.trim() || !newEpisode.content.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      // Here you would save to your database
      const episode: AudioEpisode = {
        id: Date.now().toString(),
        title: newEpisode.title,
        description: newEpisode.description,
        audioUrl,
        duration: Math.ceil(newEpisode.content.split(/\s+/).length / 150) * 60, // Estimate
        voiceType: newEpisode.voiceType,
        createdAt: new Date().toISOString(),
        status: 'draft'
      }

      setEpisodes(prev => [episode, ...prev])
      setIsCreating(false)
      setNewEpisode({ title: '', description: '', content: '', voiceType: 'NARRATOR' })
      
      // Show success message
      alert('Episode saved successfully!')
    } catch (error) {
      console.error('Failed to save episode:', error)
      alert('Failed to save episode')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEpisode = (episodeId: string) => {
    if (confirm('Are you sure you want to delete this episode?')) {
      setEpisodes(prev => prev.filter(ep => ep.id !== episodeId))
      if (selectedEpisode?.id === episodeId) {
        setSelectedEpisode(null)
      }
    }
  }

  const handlePublishEpisode = (episodeId: string) => {
    setEpisodes(prev => prev.map(ep => 
      ep.id === episodeId ? { ...ep, status: 'published' as const } : ep
    ))
  }

  // Handle file upload
  const handleFileUpload = async (file: File, type: 'audio' | 'image') => {
    if (!file) return null

    setUploading(true)
    setUploadProgress(prev => ({ ...prev, [type]: 0 }))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      setUploadProgress(prev => ({ ...prev, [type]: 100 }))
      return result.url
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload ${type} file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(prev => ({ ...prev, [type]: 0 })), 1000)
    }
  }

  // Handle episode creation
  const handleCreateEpisodeWithFiles = async () => {
    if (!newEpisode.title.trim() || !newEpisode.description.trim()) {
      alert('Please provide a title and description.')
      return
    }

    if (!audioFile && !newEpisode.content.trim()) {
      alert('Please provide either an audio file or content for generation.')
      return
    }

    setSaving(true)
    try {
      let audioFileUrl: string | null = null
      let coverImageUrl: string | null = null

      // Upload files if provided
      if (audioFile) {
        audioFileUrl = await handleFileUpload(audioFile, 'audio')
        if (!audioFileUrl) return
      }

      if (coverImage) {
        coverImageUrl = await handleFileUpload(coverImage, 'image')
        // Don't return if image upload fails, it's optional
      }

      // Create episode
      const response = await fetch('/api/admin/episodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newEpisode.title,
          description: newEpisode.description,
          content: newEpisode.content,
          audioFileUrl,
          coverImageUrl,
          sources,
          voiceType: newEpisode.voiceType,
          status: 'draft'
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create episode')
      }

      const result = await response.json()
      alert('Episode created successfully!')
      
      // Reset form
      setNewEpisode({
        title: '',
        description: '',
        content: '',
        voiceType: 'NARRATOR'
      })
      setCoverImage(null)
      setAudioFile(null)
      setSources('')
      setIsCreating(false)
      
      // Refresh episodes list
      // You can add a refresh function here if needed
      
    } catch (error) {
      console.error('Episode creation error:', error)
      alert(`Failed to create episode: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Audio Episode Management</h1>
            <p className="text-gray-400">Create and manage pre-recorded audio episodes for case files</p>
          </div>
          <Button
            onClick={handleCreateEpisode}
            className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Episode
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Episode List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Episodes</h2>
            
            {episodes.length === 0 ? (
              <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-8 text-center">
                <Volume2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No episodes created yet</p>
                <Button onClick={handleCreateEpisode} variant="outline">
                  Create First Episode
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className={`bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedEpisode?.id === episode.id ? 'border-accent-yellow bg-accent-yellow/10' : 'hover:bg-bg-secondary/80'
                    }`}
                    onClick={() => setSelectedEpisode(episode)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{episode.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{episode.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            {episode.voiceType}
                          </span>
                          <span>{Math.floor(episode.duration / 60)}m {episode.duration % 60}s</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            episode.status === 'published' 
                              ? 'bg-green-900/20 text-green-400' 
                              : 'bg-yellow-900/20 text-yellow-400'
                          }`}>
                            {episode.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {episode.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePublishEpisode(episode.id)
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEpisode(episode.id)
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Episode Editor/Player */}
          <div className="space-y-4">
            {isCreating ? (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Create New Episode</h2>
                
                <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Episode Title</label>
                    <Input
                      value={newEpisode.title}
                      onChange={(e) => setNewEpisode(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter episode title..."
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <Input
                      value={newEpisode.description}
                      onChange={(e) => setNewEpisode(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the episode..."
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Content</label>
                    <textarea
                      value={newEpisode.content}
                      onChange={(e) => setNewEpisode(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter the text content for audio generation..."
                      className="w-full h-32 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-white placeholder-gray-400 resize-none"
                    />
                  </div>

                  {/* Sources / References */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Sources / References</label>
                    <textarea
                      value={sources}
                      onChange={e => setSources(e.target.value)}
                      placeholder="Paste links, book titles, articles, or references here..."
                      className="w-full h-20 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-white placeholder-gray-400 resize-none"
                    />
                  </div>
                  <div className="text-xs text-gray-400 italic mt-2">
                    All episodes are thoroughly researched and sources are provided. Some aspects of the story may be dramatized for narrative effect.
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Cover Image (PNG/JPG)</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-white"
                    />
                    {coverImage && (
                      <p className="text-sm text-gray-400 mt-1">Selected: {coverImage.name}</p>
                    )}
                    {uploadProgress.image !== undefined && uploadProgress.image > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-accent-yellow h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress.image}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Uploading: {uploadProgress.image}%</p>
                      </div>
                    )}
                  </div>

                  {/* Audio File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Audio File (MP3)</label>
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp3"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-white"
                    />
                    {audioFile && (
                      <p className="text-sm text-gray-400 mt-1">Selected: {audioFile.name}</p>
                    )}
                    {uploadProgress.audio !== undefined && uploadProgress.audio > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-accent-yellow h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress.audio}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Uploading: {uploadProgress.audio}%</p>
                      </div>
                    )}
                  </div>

                  <AudioGenerator
                    text={newEpisode.content}
                    title={newEpisode.title || 'New Episode'}
                    voiceType={newEpisode.voiceType}
                    onAudioGenerated={handleSaveEpisode}
                  />

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => setIsCreating(false)}
                      variant="outline"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateEpisodeWithFiles}
                      disabled={saving || uploading || (!newEpisode.title.trim() || !newEpisode.description.trim() || (!audioFile && !newEpisode.content.trim()))}
                      className="w-full bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating Episode...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Create Episode
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : selectedEpisode ? (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Episode Details</h2>
                
                <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">{selectedEpisode.title}</h3>
                    <p className="text-gray-400 mb-4">{selectedEpisode.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>Voice: {selectedEpisode.voiceType}</span>
                      <span>Duration: {Math.floor(selectedEpisode.duration / 60)}m {selectedEpisode.duration % 60}s</span>
                      <span>Created: {new Date(selectedEpisode.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <AudioPlayer
                    audioUrl={selectedEpisode.audioUrl}
                    title={selectedEpisode.title}
                    duration={selectedEpisode.duration}
                  />

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Episode
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Attach to Case
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-8 text-center">
                <Volume2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Select an episode to view details or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 