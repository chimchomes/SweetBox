// app/api/elements/[id]/route.ts
import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/http'
import { supabase } from '@/lib/db'

// PATCH /api/elements/[id]?project_id=... 
// body: { description?: string }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const elementId = params.id
    const projectId = req.nextUrl.searchParams.get('project_id') || ''
    if (!elementId || !projectId) {
      return errorResponse('Missing element id or project_id', 400)
    }

    const body = await req.json().catch(() => ({}))
    const fieldsToUpdate: any = {}
    if (typeof body.description === 'string') {
      fieldsToUpdate.description = body.description
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return errorResponse('No valid fields to update', 400)
    }

    // run update in Supabase
    const { data, error } = await supabase
      .from('elements')
      .update(fieldsToUpdate)
      .eq('project_id', projectId)
      .eq('element_id', elementId)
      .select('*')
      .single()

    if (error) {
      console.error('PATCH /api/elements supabase error:', error)
      return errorResponse('DB error (update element)', 500)
    }

    if (!data) {
      return errorResponse('Element not found', 404)
    }

    return jsonResponse({ ok: true, element: data })
  } catch (err: any) {
    console.error('PATCH /api/elements fatal:', err)
    return errorResponse('Internal Server Error (/api/elements/[id])', 500)
  }
}
