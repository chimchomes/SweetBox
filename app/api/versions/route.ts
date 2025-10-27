// app/api/versions/route.ts
import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/http'
import { supabase } from '@/lib/db'
import {
  loadProjectAndElements,
  buildAiBuilderPrompt,
  buildDeveloperSpec,
  buildMachineRegistry
} from '@/lib/compile'

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get('project_id') || ''
    if (!projectId) return errorResponse('Missing project_id', 400)

    const { data, error } = await supabase
      .from('versions')
      .select('id, project_id, tag, note, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/versions error:', error)
      return errorResponse('DB error (versions list)', 500)
    }

    return jsonResponse({ versions: data || [] })
  } catch (err: any) {
    console.error('GET /api/versions fatal:', err)
    return errorResponse('Internal Server Error (/api/versions)', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const projectId = (body.project_id || '').toString().trim()
    const tag = (body.tag || '').toString().trim() || null
    const note = (body.note || '').toString().trim() || null
    if (!projectId) return errorResponse('project_id required', 400)

    const { projectMeta, elements } = await loadProjectAndElements(supabase, projectId)

    const ai_builder_prompt = buildAiBuilderPrompt(projectId, elements)
    const developer_spec = buildDeveloperSpec(projectId, elements, projectMeta)
    const machine_registry = buildMachineRegistry(projectId, elements)

    const { data, error } = await supabase
      .from('versions')
      .insert([{
        project_id: projectId,
        tag,
        note,
        ai_builder_prompt,
        developer_spec,
        machine_registry
      }])
      .select('id, project_id, tag, note, created_at')
      .single()

    if (error) {
      console.error('POST /api/versions insert error:', error)
      return errorResponse('DB insert error (versions)', 500)
    }

    return jsonResponse({ ok: true, version: data })
  } catch (err: any) {
    console.error('POST /api/versions fatal:', err)
    return errorResponse('Internal Server Error (/api/versions)', 500)
  }
}
