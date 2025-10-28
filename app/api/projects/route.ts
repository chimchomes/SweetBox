// app/api/projects/route.ts
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jsonResponse, errorResponse } from '@/lib/http'
import { listProjects } from '@/lib/memoryStore'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// GET /api/projects
export async function GET(req: NextRequest) {
  try {
    const sb = getSupabase()
    if (sb) {
      const { data, error } = await sb
        .from('projects')
        .select('project_id, project_name')
        .order('project_id', { ascending: true })

      if (!error && data) return jsonResponse({ projects: data })
      if (error) console.error('Supabase /api/projects error:', error)
    }

    const fallback = listProjects()
    return jsonResponse({ projects: fallback })
  } catch (err: any) {
    console.error('GET /api/projects failed:', err)
    return errorResponse('Internal Server Error (/api/projects)', 500)
  }
}