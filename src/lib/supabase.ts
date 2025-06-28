import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for our application
export interface User {
  id: string
  email: string
  name: string
  image?: string
  plan: 'hobby' | 'pro'
  jobs_this_month: number
  created_at: string
  updated_at: string
}

export interface ContentJob {
  id: string
  user_id: string
  source_type: 'youtube' | 'blog' | 'post'
  source_text: string
  target_platforms: string[]
  generated_content: { [platform: string]: string }
  created_at: string
} 