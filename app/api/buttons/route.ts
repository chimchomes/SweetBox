import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { listElements, addElement } from "@/lib/memoryStore";

// GET /api/buttons?project_id=...
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("project_id") || "";
    if (!projectId) {
      return errorResponse("project_id is required", 400);
    }

    const buttons = listElements(projectId, "button");

    return jsonResponse(
      {
        ok: true,
        data: buttons,
      },
      200
    );
  } catch (e) {
    console.error("GET /api/buttons error:", e);
    return errorResponse("Internal Server Error (GET /api/buttons)", 500);
  }
}

// POST /api/buttons
export async function POST(req: NextRequest) {
  try {
    let body: any = null;

    try {
      body = await req.json();
    } catch (err) {
      console.error("POST /api/buttons invalid JSON:", err);
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
      type: "button",
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
    console.error("POST /api/buttons error:", e);
    return errorResponse("Internal Server Error (POST /api/buttons)", 500);
  }
}
