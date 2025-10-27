// app/api/compile/route.ts
import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { supabase } from "@/lib/db";
import {
  loadProjectAndElements,
  buildAiBuilderPrompt,
  buildDeveloperSpec,
  buildMachineRegistry,
  buildDatabaseSQL
} from "@/lib/compile";

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("project_id") || "";
    if (!projectId) return errorResponse("Missing project_id", 400);

    const { projectMeta, elements } = await loadProjectAndElements(supabase, projectId);

    const ai_builder_prompt = buildAiBuilderPrompt(projectId, elements);
    const developer_spec   = buildDeveloperSpec(projectId, elements, projectMeta);
    const machine_registry = buildMachineRegistry(projectId, elements);
    const db_sql_schema    = buildDatabaseSQL();

    return jsonResponse({
      ai_builder_prompt,
      developer_spec,
      machine_registry,
      db_sql_schema
    });
  } catch (err: any) {
    console.error("GET /api/compile fatal:", err);
    return errorResponse("Internal Server Error (/api/compile)", 500);
  }
}
