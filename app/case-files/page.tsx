'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Search, Filter, FileText } from 'lucide-react'
import { useAuth } from '../../providers/auth-provider'
import { getCaseFiles } from '../../lib/case-files/actions'
import { CaseFileCard } from '../../components/case-files/case-file-card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { TagFilter } from '../../components/case-files/tag-filter'
import type { CaseFile, CaseFilesFilter as CaseFilesFilterType } from '../../types/case-files'

export default function CaseFilesPage() {
  const router = useRouter()
  const { isInvestigator } = useAuth()
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<CaseFilesFilterType>({
    status: 'published'
  })

  useEffect(() => {
    const loadCaseFiles = async () => {
      try {
        setLoading(true)
        setError(null)
        const { caseFiles: files, error } = await getCaseFiles({
          tags: selectedTags,
          ...filter,
          search: searchQuery
        })

        if (error) throw error
        setCaseFiles(files || [])
      } catch (err) {
        console.error('Failed to load case files:', err)
        setError('Failed to load case files. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadCaseFiles()
  }, [selectedTags, filter, searchQuery])

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => [...prev, tag])
  }

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-text-primary">Case Files</h1>
        <p className="text-lg text-text-muted">
          Explore our collection of meticulously documented true crime cases
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <Input
            type="text"
            placeholder="Search case files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setFilter({ ...filter, required_tier: filter.required_tier === 'investigator' ? undefined : 'investigator' })}
          >
            <Filter className="mr-2 h-4 w-4" />
            {filter.required_tier === 'investigator' ? 'Premium Only' : 'All Cases'}
          </Button>

          <select
            value={filter.difficulty_level || ''}
            onChange={(e) => setFilter({ ...filter, difficulty_level: e.target.value as CaseFile['difficulty_level'] || undefined })}
            className="rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-text-primary"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="mb-8">
        <TagFilter
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 rounded-lg bg-accent-red/20 p-4 text-accent-red">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-yellow border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* No Results */}
          {caseFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-16 w-16 text-text-muted" />
              <h3 className="mb-2 text-xl font-bold text-text-primary">No Case Files Found</h3>
              <p className="text-text-muted">
                {searchQuery
                  ? 'Try adjusting your search terms or filters'
                  : 'Check back soon for new cases'}
              </p>
            </div>
          ) : (
            /* Case Files Grid */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseFiles.map((caseFile) => (
                <CaseFileCard
                  key={caseFile.id}
                  caseFile={caseFile}
                  isInvestigator={isInvestigator}
                  onTagClick={handleTagSelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
} 