'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Save, X } from 'lucide-react'
import { useAuth } from '../../../providers/auth-provider'
import { getCaseFilesService } from '../../../lib/case-files/case-files-service'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { MarkdownEditor } from '../../../components/case-files/markdown-editor'
import { TagInput } from '../../../components/case-files/tag-input'
import type { CaseFileCreate } from '../../../types/case-files'

type FormData = Omit<CaseFileCreate, 'published'> & {
  published?: boolean
}

const initialFormData: FormData = {
  title: '',
  summary: '',
  content: '',
  difficulty_level: 'beginner',
  required_tier: 'free',
  tags: [],
  audio_url: '',
  featured_image_url: '',
  published: false
}

export default function CreateCaseFilePage() {
  const router = useRouter()
  const { isInvestigator, user } = useAuth()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isInvestigator) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-16 w-16 text-accent-red mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
        <p className="text-text-muted mb-8">Only investigators can create case files.</p>
        <Button onClick={() => router.push('/membership')}>
          Become an Investigator
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      const caseFilesService = getCaseFilesService()
      const { error } = await caseFilesService.createCaseFile({
        ...formData,
        published: true // Always publish when creating
      })

      if (error) throw error
      router.push('/case-files')
    } catch (err) {
      console.error('Failed to create case file:', err)
      setError('Failed to create case file. Please try again later.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Case File</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        {error && (
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-4 mb-6">
            <p className="text-accent-red">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Enter case file title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  required
                  placeholder="Brief summary of the case"
                  className="w-full h-24 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={content => setFormData(prev => ({ ...prev, content }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                <select
                  value={formData.difficulty_level}
                  onChange={e => setFormData(prev => ({ ...prev, difficulty_level: e.target.value as FormData['difficulty_level'] }))}
                  className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Required Tier</label>
                <select
                  value={formData.required_tier}
                  onChange={e => setFormData(prev => ({ ...prev, required_tier: e.target.value as FormData['required_tier'] }))}
                  className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                >
                  <option value="free">Free</option>
                  <option value="investigator">Investigator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
            <h2 className="text-xl font-semibold mb-4">Media</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                <Input
                  type="url"
                  value={formData.featured_image_url || ''}
                  onChange={e => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Audio Narration URL</label>
                <Input
                  type="url"
                  value={formData.audio_url || ''}
                  onChange={e => setFormData(prev => ({ ...prev, audio_url: e.target.value }))}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            
            <div className="space-y-4">
              <TagInput
                value={formData.tags}
                onChange={tags => setFormData(prev => ({ ...prev, tags }))}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <Button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Create Case File'}
          </Button>
        </div>
      </form>
    </div>
  )
} 