'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { getRelatedTags } from '../../lib/case-files/actions'
import type { Tag } from '../../types/case-files'

interface TagFilterProps {
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  onTagRemove: (tag: string) => void
}

export function TagFilter({ selectedTags, onTagSelect, onTagRemove }: TagFilterProps) {
  const [relatedTags, setRelatedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadRelatedTags = async () => {
      try {
        setLoading(true)
        const { tags, error } = await getRelatedTags(selectedTags)

        if (error) throw error
        setRelatedTags(tags || [])
      } catch (err) {
        console.error('Failed to load related tags:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRelatedTags()
  }, [selectedTags])

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Selected Tags</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="bg-accent-yellow/20 text-accent-yellow px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onTagRemove(tag)}
                  className="text-accent-yellow/60 hover:text-accent-yellow"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Tags */}
      {loading ? (
        <div className="text-sm text-text-muted">Loading related tags...</div>
      ) : relatedTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Related Tags</h3>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map(tag => (
              <Button
                key={tag.id}
                variant="ghost"
                size="sm"
                onClick={() => onTagSelect(tag.name)}
                className="hover:bg-accent-yellow/20 hover:text-accent-yellow"
                disabled={selectedTags.includes(tag.name)}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 