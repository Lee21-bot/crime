import { Database } from './database'

export type CaseFileStatus = 'draft' | 'published' | 'archived'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type RequiredTier = 'free' | 'investigator'

export type Tag = {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export type Comment = {
  id: string
  case_file_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: {
    email: string
    display_name?: string
  }
}

export type CaseFile = {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  difficulty_level: DifficultyLevel
  required_tier: RequiredTier
  featured_image_url: string | null
  audio_url: string | null
  tags: string[]
  created_at: string
  updated_at: string
  view_count: number
  author_id: string
  status: CaseFileStatus
  published: boolean
}

export type CaseFileCreate = {
  title: string
  summary: string
  content: string
  difficulty_level: DifficultyLevel
  required_tier: RequiredTier
  featured_image_url?: string | null
  audio_url?: string | null
  tags: string[]
  published: boolean
}

export type CaseFileUpdate = Partial<CaseFileCreate>

export type CaseFilesResponse = {
  caseFiles: CaseFile[]
  error: Error | null
}

export type CaseFileResponse = {
  caseFile: CaseFile | null
  error: Error | null
}

export type TagsResponse = {
  tags: Tag[]
  error: Error | null
}

export type TagResponse = {
  tag: Tag | null
  error: Error | null
}

export type CommentsResponse = {
  comments: Comment[]
  error: Error | null
}

// Helper type to get the case files table type from the database
export type Tables = Database['public']['Tables']
export type CaseFileTable = Tables['case_files']['Row']
export type TagTable = Tables['tags']['Row']
export type CaseFileTagTable = Tables['case_files_tags']['Row']
export type CommentTable = Tables['case_file_comments']['Row']

export type CaseFilesFilter = {
  page?: number
  limit?: number
  difficulty_level?: DifficultyLevel
  required_tier?: RequiredTier
  tags?: string[]
  search?: string
  status?: CaseFileStatus
} 