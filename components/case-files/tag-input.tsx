'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { getCaseFilesService } from '../../lib/case-files/case-files-service'
import type { Tag } from '../../types/case-files'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!input.trim()) {
        setSuggestions([])
        return
      }

      try {
        setLoading(true)
        const caseFilesService = getCaseFilesService()
        const { tags, error } = await caseFilesService.getTags()

        if (error) throw error

        const filteredTags = tags
          .filter(tag => 
            tag.name.toLowerCase().includes(input.toLowerCase()) &&
            !value.includes(tag.name)
          )
          .slice(0, 5)

        setSuggestions(filteredTags)
        setShowSuggestions(true)
      } catch (err) {
        console.error('Failed to load tag suggestions:', err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(loadSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [input, value])

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
      setInput('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a tag"
            className="flex-1"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag(input)
              }
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <Button
            type="button"
            onClick={() => addTag(input)}
            disabled={!input.trim()}
          >
            Add
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-bg-secondary border border-border-primary rounded-lg shadow-lg"
          >
            {loading ? (
              <div className="p-2 text-center text-text-muted">
                Loading...
              </div>
            ) : (
              <ul>
                {suggestions.map(tag => (
                  <li
                    key={tag.id}
                    className="px-4 py-2 hover:bg-bg-tertiary cursor-pointer transition-colors"
                    onClick={() => addTag(tag.name)}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <span
            key={tag}
            className="bg-bg-tertiary px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-text-muted hover:text-accent-red"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
} 