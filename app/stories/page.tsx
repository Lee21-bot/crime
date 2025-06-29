'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../providers/auth-provider'
import { AudioPlayer } from '../../components/audio/audio-player'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Volume2, 
  Play, 
  Clock, 
  User, 
  Calendar,
  Search,
  Filter,
  Headphones,
  Lock
} from 'lucide-react'
import { ConditionalAd, HeaderBannerAd, SidebarAd, ContentAd, FooterBannerAd } from '../../components/ui/google-ads'

interface AudioStory {
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

export default function StoriesPage() {
  const { user, isInvestigator, isAdmin, loading } = useAuth()
  const [stories, setStories] = useState<AudioStory[]>([])
  const [selectedStory, setSelectedStory] = useState<AudioStory | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVoice, setSelectedVoice] = useState<string>('all')
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [loadingStories, setLoadingStories] = useState(true)

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const endpoint = isAdmin ? '/api/stories?all=1' : '/api/stories'
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          setStories(data.stories || [])
        } else {
          console.error('Failed to fetch stories')
        }
      } catch (error) {
        console.error('Error fetching stories:', error)
      } finally {
        setLoadingStories(false)
      }
    }
    // Only fetch when loading is done (so isAdmin is correct)
    if (!loading) fetchStories()
  }, [isAdmin, loading])

  // Filter stories based on search and voice type
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (story.description && story.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         story.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesVoice = selectedVoice === 'all' || story.voice_type === selectedVoice
    // Admins see all, others only published
    const statusOk = isAdmin ? story.status !== 'archived' : story.status === 'published'
    return matchesSearch && matchesVoice && statusOk
  })

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handlePlayStory = (storyId: string) => {
    setIsPlaying(storyId)
    setSelectedStory(stories.find(s => s.id === storyId) || null)
  }

  const handleStopPlaying = () => {
    setIsPlaying(null)
  }

  // Show loading state
  if (loading || loadingStories) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-yellow mx-auto mb-4"></div>
        <p className="text-gray-400">Loading stories...</p>
      </div>
    )
  }

  // Check access - show free user view if not investigator
  if (!isInvestigator) {
    // Free users: show only the first story as a sample
    const sampleStory = filteredStories[0]
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Sample Audio Story</h1>
        <p className="text-gray-400 mb-8">
          Enjoy a free sample episode below. Upgrade to Investigator to unlock all audio stories and new weekly episodes!
        </p>
        {sampleStory ? (
          <div className="max-w-xl mx-auto mb-8">
            <div className="bg-bg-secondary/80 rounded-lg p-6 mb-4">
              <h2 className="text-xl font-semibold mb-2">{sampleStory.title}</h2>
              <p className="text-text-muted mb-2">{sampleStory.description || 'Listen to this exclusive audio story.'}</p>
              <AudioPlayer 
                audioUrl={sampleStory.audio_url} 
                title={sampleStory.title} 
                onPlay={() => handlePlayStory(sampleStory.id)} 
                onPause={handleStopPlaying} 
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{formatDuration(sampleStory.duration_seconds)}</span>
                <span>{formatDate(sampleStory.created_at)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto mb-8">
            <div className="bg-bg-secondary/80 rounded-lg p-6 mb-4">
              <h2 className="text-xl font-semibold mb-2">No Stories Available</h2>
              <p className="text-text-muted mb-2">Check back soon for new audio stories!</p>
            </div>
          </div>
        )}
        <a href="/membership" className="block mt-8">
          <div className="bg-gradient-to-r from-accent-yellow/10 to-red-500/10 border border-accent-yellow/20 rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-white mb-2">Unlock All Stories</h3>
            <p className="text-gray-400 mb-4">
              Become an Investigator to access the full library of audio stories, new weekly episodes, and an ad-free experience.
            </p>
            <Button className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary">
              Upgrade to Investigator
            </Button>
          </div>
        </a>
        {/* Ad for free users */}
        <ConditionalAd showForFreeUsers={true} showForInvestigators={false} userMembership={null}>
          <HeaderBannerAd />
        </ConditionalAd>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Audio Stories</h1>
          <p className="text-lg text-gray-400 mb-6">
            Immerse yourself in professionally narrated true crime stories, 
            created exclusively for our Investigator community.
          </p>
          
          {/* Header Banner Ad - Free Users Only */}
          <ConditionalAd 
            showForFreeUsers={true} 
            showForInvestigators={false}
            userMembership={isInvestigator ? 'investigator' : null}
          >
            <HeaderBannerAd />
          </ConditionalAd>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Headphones className="w-8 h-8 text-accent-yellow" />
                <div>
                  <p className="text-2xl font-bold text-white">{filteredStories.length}</p>
                  <p className="text-sm text-gray-400">Episodes Available</p>
                </div>
              </div>
            </div>
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-accent-yellow" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(filteredStories.reduce((acc, s) => acc + s.duration_seconds, 0) / 60)}
                  </p>
                  <p className="text-sm text-gray-400">Hours of Content</p>
                </div>
              </div>
            </div>
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-4">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-accent-yellow" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {new Set(filteredStories.map(s => s.voice_type)).size}
                  </p>
                  <p className="text-sm text-gray-400">Narrators</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-bg-secondary/50 border-border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-bg-secondary/50 border border-border-primary rounded-md px-3 py-2 text-white"
            >
              <option value="all">All Voices</option>
              <option value="NARRATOR">Narrator</option>
              <option value="DETECTIVE">Detective</option>
              <option value="REPORTER">Reporter</option>
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-16">
            <Headphones className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Stories Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-6 hover:bg-bg-secondary/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{story.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                      {story.description || 'Listen to this exclusive audio story.'}
                    </p>
                  </div>
                </div>

                <AudioPlayer 
                  audioUrl={story.audio_url} 
                  title={story.title} 
                  onPlay={() => handlePlayStory(story.id)} 
                  onPause={handleStopPlaying} 
                />

                <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      {story.voice_type}
                    </span>
                    <span>{formatDuration(story.duration_seconds)}</span>
                  </div>
                  <span>{formatDate(story.created_at)}</span>
                  {isAdmin && story.status === 'draft' && (
                    <span className="ml-2 px-2 py-1 bg-yellow-700 text-yellow-200 text-xs rounded-full">Draft</span>
                  )}
                </div>

                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent-yellow/20 text-accent-yellow text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sidebar Ad - Free Users Only */}
        <ConditionalAd 
          showForFreeUsers={true} 
          showForInvestigators={false}
          userMembership={isInvestigator ? 'investigator' : null}
        >
          <div className="mt-8">
            <SidebarAd />
          </div>
        </ConditionalAd>

        {/* Footer Banner Ad - Free Users Only */}
        <ConditionalAd 
          showForFreeUsers={true} 
          showForInvestigators={false}
          userMembership={isInvestigator ? 'investigator' : null}
        >
          <div className="mt-8">
            <FooterBannerAd />
          </div>
        </ConditionalAd>
      </div>
    </div>
  )
} 