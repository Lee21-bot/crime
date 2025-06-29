'use client'

import Link from 'next/link'
import { Lock, Star, Eye, Clock, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { CaseFile } from '../../types/case-files'

interface CaseFilePreviewProps {
  caseFile: CaseFile
  isInvestigator: boolean
}

export function CaseFilePreview({ caseFile, isInvestigator }: CaseFilePreviewProps) {
  const isLocked = caseFile.required_tier === 'investigator' && !isInvestigator
  const hasAudio = Boolean(caseFile.audio_url)

  // Handle different tag formats
  const getTagName = (tag: string | { id: string; name: string }) => {
    return typeof tag === 'string' ? tag : tag.name
  }

  const getTagId = (tag: string | { id: string; name: string }) => {
    return typeof tag === 'string' ? tag : tag.id
  }

  // Get preview content (first 200 characters)
  const getPreviewContent = (content: string) => {
    const strippedContent = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    return strippedContent.length > 200 
      ? strippedContent.substring(0, 200) + '...'
      : strippedContent
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{caseFile.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {caseFile.view_count || 0}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(new Date(caseFile.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-3 mb-4">
        {isLocked && (
          <span className="flex items-center gap-1 text-yellow-500 text-sm">
            <Lock className="h-4 w-4" />
            Premium
          </span>
        )}
        {hasAudio && (
          <span className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star className="h-4 w-4" />
            Audio
          </span>
        )}
        {caseFile.required_tier === 'investigator' && (
          <span className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star className="h-4 w-4" />
            Premium Case
          </span>
        )}
      </div>

      {/* Tags */}
      {caseFile.tags && caseFile.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {caseFile.tags.slice(0, 5).map(tag => (
            <span
              key={getTagId(tag)}
              className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400 border border-gray-600/50"
            >
              {getTagName(tag)}
            </span>
          ))}
          {caseFile.tags.length > 5 && (
            <span className="text-xs text-gray-400 px-2 py-1">
              +{caseFile.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Content Preview */}
      <div className="mt-4 p-4 bg-gray-700/20 rounded-lg border border-gray-600/50">
        {isLocked ? (
          <>
            <h4 className="font-semibold text-white mb-2">Premium Content</h4>
            <p className="text-gray-400 text-sm mb-4">
              This case file contains detailed analysis, evidence breakdown, and expert insights.
              Upgrade to Investigator tier to access the complete content.
            </p>
            <Link
              href="/membership"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Upgrade to Access
            </Link>
          </>
        ) : (
          <>
            <h4 className="font-semibold text-white mb-2">Content Preview</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {getPreviewContent(caseFile.content)}
            </p>
            <Link
              href={`/case-files/${caseFile.slug}`}
              className="inline-block text-yellow-500 hover:text-yellow-400 text-sm font-medium mt-2 transition-colors"
            >
              Read Full Case →
            </Link>
          </>
        )}
      </div>
    </div>
  )
} 