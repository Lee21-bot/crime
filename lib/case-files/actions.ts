'use server'

import { createClient } from '../supabase/server'
import { cookies } from 'next/headers'
import type { CaseFile, CaseFilesFilter, TagsResponse } from '../../types/case-files'
import { SupabaseClient } from '@supabase/supabase-js'

export const getCaseFiles = async (filter: CaseFilesFilter = {}) => {
  const supabase = await createClient()
  try {
    let query = supabase
      .from('case_files')
      .select(`
        id, title, slug, summary, difficulty_level, required_tier, featured_image_url,
        view_count, status, published, created_at, updated_at
      `)
      .eq('published', true)

    // Apply filters
    if (filter.difficulty_level) query = query.eq('difficulty_level', filter.difficulty_level)
    if (filter.required_tier) query = query.eq('required_tier', filter.required_tier)
    if (filter.search) query = query.or(`title.ilike.%${filter.search}%,summary.ilike.%${filter.search}%`)

    // Pagination
    if (filter.page && filter.limit) {
      const start = (filter.page - 1) * filter.limit
      query = query.range(start, start + filter.limit - 1)
    }

    const { data: caseFiles, error } = await query

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === '42P01') {
        console.warn('case_files table does not exist, returning empty results')
        return []
      }
      throw error
    }

    if (!caseFiles || caseFiles.length === 0) {
      return []
    }

    // Get tags for all case files (simplified approach)
    const { data: caseFileTags, error: tagsError } = await supabase
      .from('case_files_tags')
      .select('case_file_id, tag_id')

    if (tagsError) {
      if (tagsError.code === '42P01') {
        console.warn('case_files_tags table does not exist, returning case files without tags')
        return caseFiles.map(caseFile => ({
          ...caseFile,
          tags: []
        }))
      }
      throw tagsError
    }

    // Get all tag details
    const tagIds = caseFileTags ? [...new Set(caseFileTags.map(t => t.tag_id))] : []
    let tagDetails: any[] = []
    
    if (tagIds.length > 0) {
      const { data: tags, error: tagDetailsError } = await supabase
        .from('tags')
        .select('id, name')
        .in('id', tagIds)

      if (tagDetailsError) {
        if (tagDetailsError.code === '42P01') {
          console.warn('tags table does not exist, returning case files without tags')
          return caseFiles.map(caseFile => ({
            ...caseFile,
            tags: []
          }))
        }
        throw tagDetailsError
      }
      tagDetails = tags || []
    }

    // Create a map of tag details
    const tagMap = new Map(tagDetails.map(tag => [tag.id, tag]))

    // Group tags by case file
    const tagsByCaseFile: Record<string, any[]> = {}
    if (caseFileTags) {
      caseFileTags.forEach(row => {
        if (!tagsByCaseFile[row.case_file_id]) {
          tagsByCaseFile[row.case_file_id] = []
        }
        const tag = tagMap.get(row.tag_id)
        if (tag) {
          tagsByCaseFile[row.case_file_id].push(tag)
        }
      })
    }

    // Apply tag filtering if specified
    let filteredCaseFiles = caseFiles
    if (filter.tags && filter.tags.length > 0) {
      const selectedTagNames = new Set(filter.tags)
      filteredCaseFiles = caseFiles.filter(caseFile => {
        const caseFileTags = tagsByCaseFile[caseFile.id] || []
        return caseFileTags.some(tag => selectedTagNames.has(tag.name))
      })
    }

    // Add tags to case files
    return filteredCaseFiles.map(caseFile => ({
      ...caseFile,
      tags: tagsByCaseFile[caseFile.id] || []
    }))

  } catch (error) {
    console.error('Error fetching case files:', error)
    throw error
  }
}

export const getRelatedTags = async (selectedTags: string[]): Promise<TagsResponse> => {
  const supabase = await createClient()
  try {
    if (selectedTags.length === 0) {
      // If no tags are selected, return all tags
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .limit(10)

      if (error) {
        if (error.code === '42P01') {
          console.warn('tags table does not exist, returning empty tags')
          return { tags: [], error: null }
        }
        throw error
      }

      return { tags: data || [], error: null }
    }

    // Get case files that have the selected tags
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('id, name')
      .in('name', selectedTags)

    if (tagError) {
      if (tagError.code === '42P01') {
        console.warn('tags table does not exist, returning empty tags')
        return { tags: [], error: null }
      }
      throw tagError
    }
    if (!tagData?.length) return { tags: [], error: null }

    const selectedTagIds = tagData.map(tag => tag.id)

    // Get case files that have any of the selected tags
    const { data: relatedCaseFiles, error: caseFilesError } = await supabase
      .from('case_files_tags')
      .select('case_file_id')
      .in('tag_id', selectedTagIds)

    if (caseFilesError) {
      if (caseFilesError.code === '42P01') {
        console.warn('case_files_tags table does not exist, returning empty tags')
        return { tags: [], error: null }
      }
      throw caseFilesError
    }
    if (!relatedCaseFiles?.length) return { tags: [], error: null }

    // Get all tags from those case files
    const { data: relatedTagIds, error: relatedTagsError } = await supabase
      .from('case_files_tags')
      .select('tag_id')
      .in('case_file_id', relatedCaseFiles.map(cf => cf.case_file_id))
      .not('tag_id', 'in', selectedTagIds)

    if (relatedTagsError) {
      if (relatedTagsError.code === '42P01') {
        console.warn('case_files_tags table does not exist, returning empty tags')
        return { tags: [], error: null }
      }
      throw relatedTagsError
    }

    if (!relatedTagIds?.length) return { tags: [], error: null }

    // Get unique tag IDs
    const uniqueTagIds = [...new Set(relatedTagIds.map(t => t.tag_id))]

    // Get tag details
    const { data: relatedTags, error } = await supabase
      .from('tags')
      .select('id, name')
      .in('id', uniqueTagIds)
      .limit(10)

    if (error) {
      if (error.code === '42P01') {
        console.warn('tags table does not exist, returning empty tags')
        return { tags: [], error: null }
      }
      throw error
    }

    return { tags: relatedTags || [], error: null }

  } catch (error) {
    console.error('Error fetching related tags:', error)
    return { tags: [], error: error as Error }
  }
} 