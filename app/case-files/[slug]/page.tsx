'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Lock, Star, Calendar, Tag, AlertTriangle, MessageSquare, Send } from 'lucide-react'
import { useAuth } from '../../../providers/auth-provider'
import { getCaseFilesService } from '../../../lib/case-files/case-files-service'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import type { CaseFile, Comment } from '../../../types/case-files'

export default function CaseFilePage() {
  const router = useRouter()
  const { slug } = useParams()
  const { isInvestigator, user } = useAuth()
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    loadCaseFile()
  }, [slug])

  const loadCaseFile = async () => {
    try {
      setLoading(true)
      setError(null)

      const caseFilesService = getCaseFilesService()
      const { caseFile: data, error } = await caseFilesService.getCaseFileBySlug(slug as string)

      if (error) throw error
      setCaseFile(data)
    } catch (err) {
      console.error('Failed to load case file:', err)
      setError('Failed to load case file. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !caseFile || !newComment.trim()) return

    try {
      setSubmittingComment(true)
      const caseFilesService = getCaseFilesService()
      const { error } = await caseFilesService.addComment(caseFile.id, newComment)

      if (error) throw error
      setNewComment('')
      loadCaseFile() // Reload to get the new comment
    } catch (err) {
      console.error('Failed to add comment:', err)
      setError('Failed to add comment. Please try again later.')
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-yellow border-t-transparent"></div>
      </div>
    )
  }

  if (error || !caseFile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-16 w-16 text-accent-red mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">Case File Not Found</h1>
        <p className="text-text-muted mb-8">{error || 'This case file does not exist.'}</p>
        <Button onClick={() => router.push('/case-files')}>
          Return to Case Files
        </Button>
      </div>
    )
  }

  const isLocked = caseFile.required_tier === 'investigator' && !isInvestigator

  return (
    <div className="min-h-screen">
      {/* Premium Content Banner */}
      {isLocked && (
        <div className="bg-accent-yellow/10 border-y border-accent-yellow/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-accent-yellow" />
              <p className="text-accent-yellow font-medium">
                This is a premium case file. Upgrade to access full details.
              </p>
            </div>
            <Button
              onClick={() => router.push('/membership')}
              className="bg-accent-yellow hover:bg-accent-yellow/90 text-bg-primary"
            >
              Become an Investigator
            </Button>
          </div>
        </div>
      )}

      <article className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-bg-secondary text-text-muted">
              {caseFile.difficulty_level}
            </span>
            {caseFile.audio_url && (
              <span className="flex items-center gap-2 text-sm text-accent-yellow">
                <Star className="h-4 w-4" />
                Audio Available
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-text-primary mb-4">
            {caseFile.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-text-muted mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(caseFile.created_at).toLocaleDateString()}
            </span>
            {caseFile.tags && caseFile.tags.length > 0 && (
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {caseFile.tags.map(tag => tag.name).join(', ')}
              </span>
            )}
          </div>

          <p className="text-lg text-text-muted">
            {caseFile.summary}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {isLocked ? (
            <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-8 text-center border border-border-primary">
              <Lock className="h-12 w-12 text-accent-yellow mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
              <p className="text-text-muted mb-6">
                Join our Investigator tier to access the complete case file, including:
                <br />
                Detailed timeline, evidence analysis, expert insights, and more.
              </p>
              <Button
                onClick={() => router.push('/membership')}
                className="bg-accent-yellow hover:bg-accent-yellow/90 text-bg-primary"
              >
                Upgrade to Access
              </Button>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: caseFile.content }} />
          )}
        </div>

        {/* Comments Section */}
        {!isLocked && (
          <section className="mt-12 border-t border-border-primary pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Discussion
            </h2>
            
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add your thoughts..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submittingComment ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-4 mb-8 text-center">
                <p className="text-text-muted">
                  Please <button onClick={() => router.push('/auth')} className="text-accent-yellow hover:underline">sign in</button> to join the discussion.
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {caseFile.comments && caseFile.comments.length > 0 ? (
                caseFile.comments.map(comment => (
                  <div
                    key={comment.id}
                    className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-4 border border-border-primary"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-text-primary">
                        {comment.user?.display_name || comment.user?.email}
                      </span>
                      <span className="text-sm text-text-muted">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-text-muted">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-text-muted py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </section>
        )}
      </article>
    </div>
  )
} 