'use client'

import Link from 'next/link'
import { FileText, Headphones, Lock, Eye, Clock, Star, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { CaseFile } from '../../types/case-files'

// Type for case files returned by getCaseFiles (without full content)
type CaseFileSummary = {
  id: string
  title: string
  slug: string
  summary: string
  difficulty_level: CaseFile['difficulty_level']
  required_tier: CaseFile['required_tier']
  featured_image_url: string | null
  view_count: number
  status: CaseFile['status']
  published: boolean
  created_at: string
  updated_at: string
  tags: Array<{ id: string; name: string }>
}

interface CaseFileCardProps {
  caseFile: CaseFile | CaseFileSummary
  onTagClick?: (tag: string) => void
  isInvestigator: boolean
  featured?: boolean
}

export function CaseFileCard({ caseFile, onTagClick, isInvestigator, featured = false }: CaseFileCardProps) {
  const isLocked = caseFile.required_tier === 'investigator' && !isInvestigator
  const hasAudio = 'audio_url' in caseFile && Boolean(caseFile.audio_url)

  // Handle different tag formats
  const getTagName = (tag: string | { id: string; name: string }) => {
    return typeof tag === 'string' ? tag : tag.name
  }

  const getTagId = (tag: string | { id: string; name: string }) => {
    return typeof tag === 'string' ? tag : tag.id
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'easy': return '🟢'
      case 'medium': return '🟡'
      case 'hard': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <Link
      href={`/case-files/${caseFile.slug}`}
      className={`group block bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 ${
        featured ? 'ring-2 ring-yellow-500/30' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="h-3 w-3" />
            Featured
          </span>
        </div>
      )}

      {/* Featured Image */}
      <div className="relative aspect-video bg-gray-700 overflow-hidden">
        {caseFile.featured_image_url ? (
          <img
            src={caseFile.featured_image_url}
            alt={caseFile.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No Image</p>
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Indicators */}
        <div className="absolute top-2 right-2 flex gap-1">
          {isLocked && (
            <span className="bg-gray-800/90 backdrop-blur-sm text-yellow-500 p-1.5 rounded-full shadow-lg">
              <Lock className="h-4 w-4" />
            </span>
          )}
          {hasAudio && (
            <span className="bg-gray-800/90 backdrop-blur-sm text-yellow-500 p-1.5 rounded-full shadow-lg">
              <Headphones className="h-4 w-4" />
            </span>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-800/90 backdrop-blur-sm ${getDifficultyColor(caseFile.difficulty_level)}`}>
            {getDifficultyIcon(caseFile.difficulty_level)} {caseFile.difficulty_level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2">
          {caseFile.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {caseFile.summary}
        </p>

        {/* Tags */}
        {caseFile.tags && caseFile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {caseFile.tags.slice(0, 3).map(tag => (
              <button
                key={getTagId(tag)}
                onClick={e => {
                  e.preventDefault()
                  onTagClick?.(getTagName(tag))
                }}
                className="text-xs px-2 py-1 bg-gray-700/50 rounded-full hover:bg-yellow-500/20 hover:text-yellow-500 transition-colors border border-gray-600/50"
              >
                {getTagName(tag)}
              </button>
            ))}
            {caseFile.tags.length > 3 && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{caseFile.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-600/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {caseFile.view_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(caseFile.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {/* Premium Badge */}
          {caseFile.required_tier === 'investigator' && (
            <span className="flex items-center gap-1 text-yellow-500 font-medium">
              <TrendingUp className="h-3 w-3" />
              Premium
            </span>
          )}
        </div>
      </div>
    </Link>
  )
} 