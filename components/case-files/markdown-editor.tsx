'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'
import ReactMarkdown from 'react-markdown'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content in Markdown...',
  required = false
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="text-text-muted hover:text-text-primary"
        >
          {isPreview ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Edit
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          )}
        </Button>
      </div>

      {isPreview ? (
        <div className="min-h-[400px] p-4 bg-bg-tertiary border border-border-primary rounded-lg prose prose-invert max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-text-muted italic">Nothing to preview...</p>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full h-[400px] px-4 py-4 bg-bg-tertiary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow font-mono resize-none"
        />
      )}

      {!isPreview && (
        <div className="mt-2 text-sm text-text-muted">
          <p>Markdown formatting supported:</p>
          <ul className="list-disc list-inside mt-1">
            <li># Heading 1</li>
            <li>## Heading 2</li>
            <li>**Bold text**</li>
            <li>*Italic text*</li>
            <li>[Link text](url)</li>
            <li>- Bullet points</li>
            <li>1. Numbered lists</li>
          </ul>
        </div>
      )}
    </div>
  )
} 