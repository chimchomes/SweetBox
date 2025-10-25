// app/api/projects/route.ts
import { supabase } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/projects
// Returns list of projects (basic metadata)
export async function GET() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(`[projects][GET] ${error.message}`, 500);
  }

  return jsonResponse(data || []);
}

// POST /api/projects
// Body: { project_id, project_name, app_goal?, audience?, default_route? }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!body.project_id || !body.project_name) {
    return errorResponse("project_id and project_name are required", 400);
  }

  const insertPayload = {
    project_id: body.project_id,
    project_name: body.project_name,
    app_goal: body.app_goal || null,
    audience: body.audience || null,
    default_route: body.default_route || null,
    design_tokens: body.design_tokens || {},
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([insertPayload])
    .select("*")
    .single();

  if (error) {
    return errorResponse(`[projects][POST] ${error.message}`, 500);
  }

  return jsonResponse(data, 201);
}
