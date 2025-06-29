'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, FileText, Star, TrendingUp, Clock, Eye, Lock, Crown } from 'lucide-react'
import { useAuth } from '../../providers/auth-provider'
import { getCaseFiles } from '../../lib/case-files/actions'
import { CaseFileCard } from '../../components/case-files/case-file-card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { TagFilter } from '../../components/case-files/tag-filter'
import { ConditionalAd, HeaderBannerAd, ContentAd, FooterBannerAd } from '../../components/ui/google-ads'
import type { CaseFile, CaseFilesFilter as CaseFilesFilterType } from '../../types/case-files'
import Link from 'next/link'

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

type SortOption = 'newest' | 'oldest' | 'popular' | 'title'

export default function CaseFilesPage() {
  const router = useRouter()
  const { isInvestigator, user } = useAuth()
  const [caseFiles, setCaseFiles] = useState<CaseFileSummary[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filter, setFilter] = useState<CaseFilesFilterType>({
    status: 'published'
  })

  useEffect(() => {
    const loadCaseFiles = async () => {
      try {
        setLoading(true)
        setError(null)
        const files = await getCaseFiles({
          tags: selectedTags,
          ...filter,
          search: searchQuery
        })

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

  // Sort case files
  const sortedCaseFiles = [...caseFiles].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'popular':
        return (b.view_count || 0) - (a.view_count || 0)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  // Get featured cases (first 3 premium cases or most viewed)
  const featuredCases = sortedCaseFiles
    .filter(cf => cf.required_tier === 'investigator' || cf.view_count > 100)
    .slice(0, 3)

  // Get regular cases (excluding featured)
  const regularCases = sortedCaseFiles.filter(cf => !featuredCases.includes(cf))

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-yellow"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Ad for Free Users */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Case Files</h1>
          <p className="text-lg text-gray-400 mb-6">
            Dive deep into the most intriguing true crime cases. 
            {!isInvestigator && (
              <span className="text-accent-yellow">
                {' '}Upgrade to Investigator for full access to all case details.
              </span>
            )}
          </p>
          
          {/* Header Banner Ad - Free Users Only */}
          <ConditionalAd 
            showForFreeUsers={true} 
            showForInvestigators={false}
            userMembership={isInvestigator ? 'investigator' : null}
          >
            <HeaderBannerAd />
          </ConditionalAd>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search cases, tags, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filter.difficulty_level || ''}
              onChange={(e) => setFilter({ ...filter, difficulty_level: e.target.value as CaseFile['difficulty_level'] || undefined })}
              className="px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Alphabetical</option>
            </select>
            {isInvestigator && (
              <Link href="/case-files/create">
                <Button className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </Button>
              </Link>
            )}
          </div>
          
          <TagFilter
            selectedTags={selectedTags}
            onTagSelect={(tag: string) => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              )
            }}
            onTagRemove={(tag: string) => {
              setSelectedTags(prev => prev.filter(t => t !== tag))
            }}
          />
        </div>

        {/* Content Ad - Free Users Only */}
        <ConditionalAd 
          showForFreeUsers={true} 
          showForInvestigators={false}
          userMembership={isInvestigator ? 'investigator' : null}
        >
          <ContentAd />
        </ConditionalAd>

        {/* Case Files Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {caseFiles.length} Case{caseFiles.length !== 1 ? 's' : ''} Found
            </h2>
            {!isInvestigator && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                <span>Some cases require Investigator access</span>
              </div>
            )}
          </div>

          {caseFiles.length === 0 ? (
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-border-primary rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No cases found matching your criteria.</p>
            </div>
          ) : (
            <>
              {/* Featured Cases */}
              {featuredCases.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-white">Featured Cases</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCases.map((caseFile) => (
                      <CaseFileCard
                        key={caseFile.id}
                        caseFile={caseFile}
                        featured={true}
                        isInvestigator={isInvestigator}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Cases */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    {featuredCases.length > 0 ? 'All Cases' : 'Case Files'}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularCases.map((caseFile) => (
                    <CaseFileCard
                      key={caseFile.id}
                      caseFile={caseFile}
                      featured={false}
                      isInvestigator={isInvestigator}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Banner Ad - Free Users Only */}
        <ConditionalAd 
          showForFreeUsers={true} 
          showForInvestigators={false}
          userMembership={isInvestigator ? 'investigator' : null}
        >
          <FooterBannerAd />
        </ConditionalAd>

        {/* Upgrade CTA for Free Users */}
        {!isInvestigator && (
          <Link href="/membership" className="block mt-8">
            <div className="bg-gradient-to-r from-accent-yellow/10 to-red-500/10 border border-accent-yellow/20 rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
              <Crown className="h-12 w-12 text-accent-yellow mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Unlock Full Access</h3>
              <p className="text-gray-400 mb-4">
                Become an Investigator to access complete case details, evidence analysis, and exclusive content.
              </p>
              <Button className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary">
                Upgrade to Investigator
              </Button>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
} 