'use client'

import Link from 'next/link'
import { FileText, Headphones, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { CaseFile } from '../../types/case-files'

interface CaseFileCardProps {
  caseFile: CaseFile
  onTagClick?: (tag: string) => void
  isInvestigator: boolean
}

export function CaseFileCard({ caseFile, onTagClick }: CaseFileCardProps) {
  const isLocked = caseFile.required_tier === 'investigator'
  const hasAudio = Boolean(caseFile.audio_url)

  return (
    <Link
      href={`/case-files/${caseFile.slug}`}
      className="group block bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg overflow-hidden hover:border-accent-yellow transition-colors"
    >
      {/* Featured Image */}
      <div className="relative aspect-video bg-bg-tertiary">
        {caseFile.featured_image_url ? (
          <img
            src={caseFile.featured_image_url}
            alt={caseFile.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-text-muted" />
          </div>
        )}
        {/* Indicators */}
        <div className="absolute top-2 right-2 flex gap-1">
          {isLocked && (
            <span className="bg-bg-secondary/80 backdrop-blur-sm text-text-muted p-1.5 rounded-full">
              <Lock className="h-4 w-4" />
            </span>
          )}
          {hasAudio && (
            <span className="bg-bg-secondary/80 backdrop-blur-sm text-text-muted p-1.5 rounded-full">
              <Headphones className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-accent-yellow transition-colors">
          {caseFile.title}
        </h3>
        <p className="text-text-muted text-sm mb-4 line-clamp-2">
          {caseFile.summary}
        </p>

        {/* Tags */}
        {caseFile.tags && caseFile.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {caseFile.tags.map(tag => (
              <button
                key={tag}
                onClick={e => {
                  e.preventDefault()
                  onTagClick?.(tag)
                }}
                className="text-xs px-2 py-1 bg-bg-tertiary rounded-full hover:bg-accent-yellow/20 hover:text-accent-yellow transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="capitalize">{caseFile.difficulty_level}</span>
          <span>{formatDistanceToNow(new Date(caseFile.created_at), { addSuffix: true })}</span>
        </div>
      </div>
    </Link>
  )
} 