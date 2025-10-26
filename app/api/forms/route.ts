import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { listElements, addElement } from "@/lib/memoryStore";

// GET /api/forms?project_id=...
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("project_id") || "";
    if (!projectId) {
      return errorResponse("project_id is required", 400);
    }

    const forms = listElements(projectId, "form");

    return jsonResponse(
      {
        ok: true,
        data: forms,
      },
      200
    );
  } catch (e) {
    console.error("GET /api/forms error:", e);
    return errorResponse("Internal Server Error (GET /api/forms)", 500);
  }
}

// POST /api/forms
export async function POST(req: NextRequest) {
  try {
    let body: any = null;

    try {
      body = await req.json();
    } catch (err) {
      console.error("POST /api/forms invalid JSON:", err);
      return errorResponse("invalid JSON body", 400);
    }

    const {
      project_id,
      element_id,
      display_name,
      description,
    } = body || {};

    if (!project_id || !element_id) {
      return errorResponse("project_id and element_id are required", 400);
    }

    const cleaned = addElement({
      project_id: String(project_id).trim(),
      type: "form",
      element_id: String(element_id).trim(),
      display_name: String(display_name || element_id).trim(),
      description: String(description || "").trim(),
    });

    return jsonResponse(
      {
        ok: true,
        data: cleaned,
      },
      200
    );
  } catch (e) {
    console.error("POST /api/forms error:", e);
    return errorResponse("Internal Server Error (POST /api/forms)", 500);
  }
}
