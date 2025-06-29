export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      case_files: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string
          content: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          required_tier: 'free' | 'investigator'
          featured_image_url: string | null
          audio_url: string | null
          view_count: number
          author_id: string
          status: 'draft' | 'published' | 'archived'
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary: string
          content: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          required_tier: 'free' | 'investigator'
          featured_image_url?: string | null
          audio_url?: string | null
          view_count?: number
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string
          content?: string
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          required_tier?: 'free' | 'investigator'
          featured_image_url?: string | null
          audio_url?: string | null
          view_count?: number
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      case_files_tags: {
        Row: {
          case_file_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          case_file_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          case_file_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          role: 'user' | 'investigator' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          role?: 'user' | 'investigator' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          role?: 'user' | 'investigator' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: 'free' | 'investigator' | 'detective'
          status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'incomplete'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier: 'free' | 'investigator' | 'detective'
          status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'incomplete'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: 'free' | 'investigator' | 'detective'
          status?: 'active' | 'cancelled' | 'expired' | 'past_due' | 'incomplete'
          created_at?: string
          updated_at?: string
        }
      }
      case_file_comments: {
        Row: {
          id: string
          case_file_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_file_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_file_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 