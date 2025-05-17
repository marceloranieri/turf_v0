export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          title: string
          question: string
          category: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          title: string
          question: string
          category: string
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          title?: string
          question?: string
          category?: string
          created_at?: string
          expires_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          topic_id: string
          user_id: string
          content: string
          image_url: string | null
          created_at: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          topic_id: string
          user_id: string
          content: string
          image_url?: string | null
          created_at?: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          topic_id?: string
          user_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
          parent_id?: string | null
        }
      }
      votes: {
        Row: {
          id: string
          message_id: string
          user_id: string
          is_upvote: boolean
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          is_upvote: boolean
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          is_upvote?: boolean
          created_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: string
          notifications_enabled: boolean
          direct_messages_enabled: boolean
          private_profile: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          notifications_enabled?: boolean
          direct_messages_enabled?: boolean
          private_profile?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: string
          notifications_enabled?: boolean
          direct_messages_enabled?: boolean
          private_profile?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      blocked_users: {
        Row: {
          user_id: string
          blocked_user_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          blocked_user_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          blocked_user_id?: string
          created_at?: string
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
