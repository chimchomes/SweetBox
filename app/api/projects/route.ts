// app/api/projects/route.ts
import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/http'
import { supabase } from '@/lib/db'

// GET /api/projects
// Returns list of projects from Supabase 'projects' table
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('project_id, project_name, app_goal, audience, default_route')
      .order('project_name', { ascending: true })

    if (error) {
      console.error('GET /api/projects supabase error:', error)
      return errorResponse('DB error (projects)', 500)
    }

    return jsonResponse({ projects: data || [] })
  } catch (err: any) {
    console.error('GET /api/projects fatal error:', err)
    return errorResponse('Internal Server Error (/api/projects)', 500)
  }
}
