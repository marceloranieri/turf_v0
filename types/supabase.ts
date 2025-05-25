export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      daily_topics: {
        Row: {
          id: string
          topic_id: string
          topic_text: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          topic_text: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          topic_text?: string
          date?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
