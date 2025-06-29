'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Lock, Star, Calendar, Tag, AlertTriangle, MessageSquare, Send, BookOpen, Clock, Eye, Share2, Bookmark } from 'lucide-react'
import { useAuth } from '../../../providers/auth-provider'
import { getCaseFileBySlug, addComment } from '../../../lib/case-files/case-files-service'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { InlineAd } from '../../../components/ui/google-ads'
import type { CaseFile, Comment } from '../../../types/case-files'
import { AudioGenerator } from '../../../components/audio/audio-generator'

export default function CaseFilePage() {
  const router = useRouter()
  const { slug } = useParams()
  const { isInvestigator, user } = useAuth()
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    loadCaseFile()
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadCaseFile = async () => {
    try {
      setLoading(true)
      setError(null)

      const { caseFile: data, error } = await getCaseFileBySlug(slug as string)

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
      const { error } = await addComment(caseFile.id, newComment)

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: caseFile?.title,
        text: caseFile?.summary,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
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
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Case File Not Found</h1>
        <p className="text-gray-400 mb-8">{error || 'This case file does not exist.'}</p>
        <Button onClick={() => router.push('/case-files')}>
          Return to Case Files
        </Button>
      </div>
    )
  }

  const isLocked = caseFile.required_tier === 'investigator' && !isInvestigator

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-yellow-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Premium Content Banner */}
      {isLocked && (
        <div className="bg-yellow-500/10 border-y border-yellow-500/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-yellow-500" />
              <p className="text-yellow-500 font-medium">
                This is a premium case file. Upgrade to access full details.
              </p>
            </div>
            <Button
              onClick={() => router.push('/membership')}
              className="bg-yellow-500 hover:bg-yellow-500/90 text-black"
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
            <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-gray-800 text-gray-400">
              {caseFile.difficulty_level}
            </span>
            {caseFile.audio_url && (
              <span className="flex items-center gap-2 text-sm text-yellow-500">
                <Star className="h-4 w-4" />
                Audio Available
              </span>
            )}
            {caseFile.required_tier === 'investigator' && (
              <span className="flex items-center gap-2 text-sm text-yellow-500">
                <Star className="h-4 w-4" />
                Premium Case
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {caseFile.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(caseFile.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {Math.ceil(caseFile.content.length / 1000)} min read
            </span>
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {caseFile.view_count || 0} views
            </span>
            {caseFile.tags && caseFile.tags.length > 0 && (
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {Array.isArray(caseFile.tags) ? caseFile.tags.join(', ') : caseFile.tags}
              </span>
            )}
          </div>

          <p className="text-lg text-gray-400 leading-relaxed max-w-4xl">
            {caseFile.summary}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Bookmark
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {isLocked ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-600">
              <Lock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Join our Investigator tier to access the complete case file, including:
                <br />
                Detailed timeline, evidence analysis, expert insights, and more.
              </p>
              <Button
                onClick={() => router.push('/membership')}
                className="bg-yellow-500 hover:bg-yellow-500/90 text-black"
              >
                Upgrade to Access
              </Button>
            </div>
          ) : (
            <>
              {/* Inline Ad before content */}
              <InlineAd />
              
              <div 
                className="max-w-4xl mx-auto leading-relaxed"
                dangerouslySetInnerHTML={{ __html: caseFile.content }} 
              />
              
              {/* Inline Ad after content */}
              <InlineAd />
            </>
          )}
        </div>

        {/* Comments Section - Only show for unlocked content */}
        {!isLocked && (
          <section className="mt-12 border-t border-gray-600 pt-8">
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
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-8 text-center">
                <p className="text-gray-400">
                  Please <button onClick={() => router.push('/auth')} className="text-yellow-500 hover:underline">sign in</button> to join the discussion.
                </p>
              </div>
            )}

            {/* Comments List - Note: Comments functionality would need to be implemented separately */}
            <div className="space-y-6">
              <p className="text-center text-gray-400 py-8">
                Comments feature coming soon!
              </p>
            </div>
          </section>
        )}
      </article>
    </div>
  )
} 