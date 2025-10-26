import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { listElements, addElement } from "@/lib/memoryStore";

// GET /api/pages?project_id=...
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("project_id") || "";
    if (!projectId) {
      return errorResponse("project_id is required", 400);
    }

    const pages = listElements(projectId, "page");

    return jsonResponse(
      {
        ok: true,
        data: pages,
      },
      200
    );
  } catch (e) {
    console.error("GET /api/pages error:", e);
    return errorResponse("Internal Server Error (GET /api/pages)", 500);
  }
}

// POST /api/pages
export async function POST(req: NextRequest) {
  try {
    let body: any = null;

    try {
      body = await req.json();
    } catch (err) {
      console.error("POST /api/pages invalid JSON:", err);
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
      type: "page",
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
    console.error("POST /api/pages error:", e);
    return errorResponse("Internal Server Error (POST /api/pages)", 500);
  }
}
