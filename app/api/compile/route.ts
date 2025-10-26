// app/api/compile/route.ts
// In-memory compile endpoint.
// Builds ai_builder_prompt, developer_spec, machine_registry
// from the temporary memoryStore, NOT Supabase.

import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { listElements } from "@/lib/memoryStore";

type SweetboxElement = {
  project_id: string;
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description: string;
};

// Helper to build a human-readable AI builder prompt
function buildAiBuilderPrompt(projectId: string, elements: SweetboxElement[]) {
  const pages = elements.filter((e) => e.type === "page");
  const forms = elements.filter((e) => e.type === "form");
  const buttons = elements.filter((e) => e.type === "button");

  const lines: string[] = [];
  lines.push("You are an app builder. Create an application called SweetBox.");
  lines.push(`Project ID: ${projectId}`);
  lines.push("");

  lines.push("PAGES:");
  if (pages.length === 0) {
    lines.push("  (no pages yet)");
  } else {
    pages.forEach((p) => {
      lines.push(`  - ${p.element_id}: ${p.description || "(no description)"}`);
    });
  }
  lines.push("");

  lines.push("FORMS:");
  if (forms.length === 0) {
    lines.push("  (no forms yet)");
  } else {
    forms.forEach((f) => {
      lines.push(`  - ${f.element_id}: ${f.description || "(no description)"}`);
    });
  }
  lines.push("");

  lines.push("BUTTONS:");
  if (buttons.length === 0) {
    lines.push("  (no buttons yet)");
  } else {
    buttons.forEach((b) => {
      lines.push(
        `  - ${b.element_id}: ${b.description || "(no description)"}`
      );
    });
  }
  lines.push("");
  lines.push("Build the UI screens and flows according to these elements.");
  lines.push("Generate working navigation between pages/buttons.");

  return lines.join("\n");
}

// Helper to build developer_spec (structured JSON)
function buildDeveloperSpec(projectId: string, elements: SweetboxElement[]) {
  return {
    project: {
      id: projectId,
      name: "SweetBox",
      goal:
        "Compile project spec into AI builder prompt + developer spec.",
      audience: "Product owners / internal tool builders",
      default_route: "page_dashboard",
    },
    pages: elements
      .filter((e) => e.type === "page")
      .map((e) => ({
        id: e.element_id,
        label: e.display_name,
        description: e.description,
        layout_content: null, // will come later from UI designer
        visibility: null, // future (roles, login, etc.)
      })),
    forms: elements
      .filter((e) => e.type === "form")
      .map((e) => ({
        id: e.element_id,
        label: e.display_name,
        description: e.description,
        standard_behavior: {
          paginate_max_fields: 10,
          include_prev_next: true,
          include_save_progress: true,
          include_submit: true,
        },
        form_fields: [], // future: real schema builder
        on_submit: null, // future
        post_submit: null, // future
        visibility: null,
      })),
    buttons: elements
      .filter((e) => e.type === "button")
      .map((e) => ({
        id: e.element_id,
        label: e.display_name,
        description: e.description,
        placement: null, // future: page/form location
        actions: [], // future: button actions
        visibility: null,
      })),
  };
}

// Helper to build machine_registry (raw dump)
function buildMachineRegistry(projectId: string, elements: SweetboxElement[]) {
  return {
    project_id: projectId,
    snapshot: elements,
  };
}

// GET /api/compile?project_id=sweetbox_001
export async function GET(req: NextRequest) {
  try {
    const projectId =
      req.nextUrl.searchParams.get("project_id") || "";

    if (!projectId) {
      return errorResponse("Missing project_id", 400);
    }

    // pull all elements for this project from memory
    const allForProject = listElements(projectId);

    // Build the 3 payloads
    const ai_builder_prompt = buildAiBuilderPrompt(
      projectId,
      allForProject
    );

    const developer_spec = buildDeveloperSpec(
      projectId,
      allForProject
    );

    const machine_registry = buildMachineRegistry(
      projectId,
      allForProject
    );

    return jsonResponse({
      ai_builder_prompt,
      developer_spec,
      machine_registry,
    });
  } catch (err: any) {
    console.error("GET /api/compile error:", err);
    return errorResponse("Internal Server Error (/api/compile)", 500);
  }
}