import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { supabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("project_id") || "";
    if (!projectId) return errorResponse("Missing project_id", 400);

    const { data, error } = await supabase
      .from("elements")
      .select("*")
      .eq("project_id", projectId)
      .eq("type", "page")
      .order("id");

    if (error) throw error;
    return jsonResponse({ pages: data });
  } catch (err) {
    console.error("GET /api/pages error:", err);
    return errorResponse("Internal Server Error (/api/pages)", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, element_id, display_name, description } = body;

    if (!project_id || !element_id || !display_name) {
      return errorResponse("Missing required fields", 400);
    }

    const { data, error } = await supabase
      .from("elements")
      .insert([
        {
          project_id,
          type: "page",
          element_id,
          display_name,
          description,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;
    return jsonResponse({ page: data });
  } catch (err) {
    console.error("POST /api/pages error:", err);
    return errorResponse("Internal Server Error (/api/pages)", 500);
  }
}
