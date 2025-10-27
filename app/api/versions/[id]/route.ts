// app/api/versions/[id]/route.ts
import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/http'
import { supabase } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (!id) return errorResponse('Invalid id', 400)

    const { data, error } = await supabase
      .from('versions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('GET /api/versions/[id] error:', error)
      return errorResponse('DB error (version)', 500)
    }
    if (!data) return errorResponse('Not found', 404)

    return jsonResponse({ version: data })
  } catch (err: any) {
    console.error('GET /api/versions/[id] fatal:', err)
    return errorResponse('Internal Server Error (/api/versions/[id])', 500)
  }
}
