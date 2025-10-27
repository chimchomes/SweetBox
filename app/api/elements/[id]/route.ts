// app/api/elements/[id]/route.ts
import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { updateElementDescription, listElements } from "@/lib/memoryStore";

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const elementId = params.id;
    const body = await req.json();
    const { project_id, description } = body;

    if (!project_id || !description) {
      return errorResponse("Missing project_id or description", 400);
    }

    const success = updateElementDescription(project_id, elementId, description);
    if (!success) {
      return errorResponse("Element not found", 404);
    }

    const updated = listElements(project_id).find((e) => e.element_id === elementId);
    return jsonResponse({ ok: true, updated });
  } catch (err: any) {
    console.error("PATCH /api/elements/[id] error:", err);
    return errorResponse("Internal Server Error (/api/elements/[id])", 500);
  }
}
