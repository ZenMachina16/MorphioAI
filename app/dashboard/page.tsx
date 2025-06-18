import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard-client'

export default async function Dashboard() {
  const supabase = await createServerSupabaseClient()

  // Check for active session
  const { data: { session } } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!session) {
    redirect('/auth/login')
  }

  // Get user data
  const { data: { user } } = await supabase.auth.getUser()

  // If no user (shouldn't happen if we have a session, but just to be safe)
  if (!user) {
    redirect('/auth/login')
  }

  // Render the client dashboard with user data
  return <DashboardClient user={user} />
} 