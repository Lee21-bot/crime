import { createClient } from '../supabase/server'
import { cookies } from 'next/headers'
import type {
  CaseFile,
  CaseFileCreate,
  CaseFileUpdate,
  CaseFilesResponse,
  CaseFileResponse,
  TagsResponse,
  Tag,
  CaseFilesFilter
} from '../../types/case-files'

const createSlug = async (title: string): Promise<string> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data } = await supabase.from('case_files').select('slug').eq('slug', baseSlug).single()
  if (!data) return baseSlug

  let counter = 1
  let newSlug = `${baseSlug}-${counter}`
  while (true) {
    const { data: existing } = await supabase.from('case_files').select('slug').eq('slug', newSlug).single()
    if (!existing) return newSlug
    counter++
    newSlug = `${baseSlug}-${counter}`
  }
}

export const getCaseFileBySlug = async (slug: string): Promise<CaseFileResponse> => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    try {
      const { data, error } = await supabase
        .from('case_files')
        .select('*, tags:case_files_tags(tag:tags(*))')
        .eq('slug', slug)
        .single()

      if (error) throw error

      const formattedData = {
        ...data,
        tags: data.tags.map((t: any) => t.tag.name),
      }

      return { caseFile: formattedData as CaseFile, error: null }
    } catch (error) {
      console.error(`Error fetching case file by slug ${slug}:`, error)
      return { caseFile: null, error: error as Error }
    }
}

export const createCaseFile = async (data: CaseFileCreate): Promise<CaseFileResponse> => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    try {
      const slug = await createSlug(data.title)
      const { data: caseFileData, error } = await supabase
        .from('case_files')
        .insert({ ...data, slug })
        .select()
        .single()
      
      if (error) throw error
      return { caseFile: caseFileData as CaseFile, error: null }
    } catch (error) {
      console.error('Error creating case file:', error)
      return { caseFile: null, error: error as Error }
    }
}

export const updateCaseFile = async (id: string, data: CaseFileUpdate): Promise<CaseFileResponse> => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    try {
      const { data: caseFileData, error } = await supabase
        .from('case_files')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { caseFile: caseFileData as CaseFile, error: null }
    } catch (error) {
      console.error(`Error updating case file ${id}:`, error)
      return { caseFile: null, error: error as Error }
    }
}

export const deleteCaseFile = async (id: string): Promise<{ error: Error | null }> => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    try {
      const { error } = await supabase.from('case_files').delete().eq('id', id)
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error(`Error deleting case file ${id}:`, error)
      return { error: error as Error }
    }
}

export const getTags = async (): Promise<TagsResponse> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { data, error } = await supabase.from('tags').select('*')
    if (error) throw error
    return { tags: data as Tag[], error: null }
  } catch (error) {
    console.error('Error fetching tags:', error)
    return { tags: [], error: error as Error }
  }
}

export const createTag = async (name: string) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name }])
      .select()
      .single()

    if (error) throw error

    return { tag: data, error: null }
  } catch (error) {
    console.error('Error creating tag:', error)
    return { tag: null, error: error as Error }
  }
}

export const linkTagsToCaseFile = async (caseFileId: string, tagIds: string[]) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { error } = await supabase
      .from('case_files_tags')
      .insert(tagIds.map(tagId => ({
        case_file_id: caseFileId,
        tag_id: tagId
      })))

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error linking tags to case file:', error)
    return { error: error as Error }
  }
}

export const unlinkTagsFromCaseFile = async (caseFileId: string, tagIds: string[]) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { error } = await supabase
      .from('case_files_tags')
      .delete()
      .eq('case_file_id', caseFileId)
      .in('tag_id', tagIds)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error unlinking tags from case file:', error)
    return { error: error as Error }
  }
}

export const addComment = async (caseFileId: string, content: string): Promise<{ error: Error | null }> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { error } = await supabase
      .from('case_file_comments')
      .insert({
        case_file_id: caseFileId,
        content
      })

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error adding comment:', error)
    return { error: error as Error }
  }
}

export const getComments = async (caseFileId: string) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  try {
    const { data, error } = await supabase
      .from('case_file_comments')
      .select('id, content, created_at, user_profiles(display_name)')
      .eq('case_file_id', caseFileId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { comments: data, error: null }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return { comments: [], error: error as Error }
  }
} 