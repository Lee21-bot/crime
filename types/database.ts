export interface Database {
  public: {
    Tables: {
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          tier: 'free' | 'investigator'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          tier: 'free' | 'investigator'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          tier?: 'free' | 'investigator'
          created_at?: string
          updated_at?: string
        }
      }
      chat_channels: {
        Row: {
          id: string
          name: string
          description: string | null
          required_tier: 'free' | 'investigator'
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          required_tier?: 'free' | 'investigator'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          required_tier?: 'free' | 'investigator'
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          channel_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      case_files: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string | null
          summary: string
          content: string
          date_occurred: string | null
          location: string | null
          status: 'cold_case' | 'active' | 'solved' | 'closed'
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          required_tier: 'free' | 'investigator'
          featured_image_url: string | null
          audio_url: string | null
          view_count: number
          created_at: string
          updated_at: string
          published: boolean
        }
        Insert: {
          id?: string
          slug: string
          title: string
          subtitle?: string | null
          summary: string
          content: string
          date_occurred?: string | null
          location?: string | null
          status?: 'cold_case' | 'active' | 'solved' | 'closed'
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          required_tier?: 'free' | 'investigator'
          featured_image_url?: string | null
          audio_url?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
          published?: boolean
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          summary?: string
          content?: string
          date_occurred?: string | null
          location?: string | null
          status?: 'cold_case' | 'active' | 'solved' | 'closed'
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          required_tier?: 'free' | 'investigator'
          featured_image_url?: string | null
          audio_url?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
          published?: boolean
        }
      }
      case_evidence: {
        Row: {
          id: string
          case_file_id: string
          title: string
          description: string | null
          image_url: string | null
          evidence_type: 'photo' | 'document' | 'video' | 'audio' | 'other'
          display_order: number
        }
        Insert: {
          id?: string
          case_file_id: string
          title: string
          description?: string | null
          image_url?: string | null
          evidence_type?: 'photo' | 'document' | 'video' | 'audio' | 'other'
          display_order?: number
        }
        Update: {
          id?: string
          case_file_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          evidence_type?: 'photo' | 'document' | 'video' | 'audio' | 'other'
          display_order?: number
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 