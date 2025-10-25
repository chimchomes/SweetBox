// app/api/compile/route.ts
// Stub for Phase 3 compile/export service.
// Keeps dev server running even before full logic is implemented.

import { jsonResponse } from "@/lib/http";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("project_id") || "UNKNOWN";

  return jsonResponse({
    status: "stub",
    projectId,
    message:
      "Compile endpoint not implemented yet. This will generate AI Builder Prompt, Dev Spec, and Registry in Phase 3."
  });
}
