export type VisibilityMode = 'ORG' | 'TEAM' | 'DOMAIN' | 'PRIVATE' | 'CUSTOM'

export interface Team { id: string; name: string }
export interface Domain { id: string; key: string; name: string; parent_domain_id?: string | null }
export interface Tag { id: string; key: string; name: string }

export interface Prompt {
  id: string
  title: string
  description?: string
  content: string
  author_id?: string
  visibility_mode: VisibilityMode
  created_at: string
  updated_at: string
  use_count: number
  avg_rating?: number | null
  rating_count: number
  tags: Tag[]
  classified_domains: Domain[]
}

export interface Comment {
  id: string
  prompt_id: string
  user_id: string
  user_name?: string
  text: string
  created_at: string
}

export interface LeaderboardItem {
  user_id: string
  name: string
  prompt_count: number
  total_use_count: number
  avg_rating?: number | null
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}
