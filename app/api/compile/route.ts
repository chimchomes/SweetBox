// app/api/compile/route.ts
import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/http";
import { listElements } from "@/lib/memoryStore";
import { describeActions } from "@/lib/actions";

type SweetboxElement = {
  project_id: string;
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description: string;
  button_actions?: {
    action_type: "navigate" | "save_progress" | "submit_form" | "custom";
    details: string;
    target?: string;
  }[];
};

// --- DB model builders ------------------------------------------------

function buildDatabaseModel(projectId: string, elements: SweetboxElement[]) {
  return {
    provider: "supabase",
    tables: [
      {
        name: "projects",
        description: "Top-level SweetBox projects",
        columns: [
          { name: "project_id", type: "text", primary_key: true, nullable: false },
          { name: "project_name", type: "text", nullable: false }
        ]
      },
      {
        name: "elements",
        description: "Pages, Forms, Buttons defined by the user",
        columns: [
          { name: "id", type: "bigserial", primary_key: true, nullable: false, generated: "identity" },
          { name: "project_id", type: "text", nullable: false, references: "projects.project_id" },
          { name: "type", type: "text", nullable: false }, // page | form | button
          { name: "element_id", type: "text", nullable: false },
          { name: "display_name", type: "text", nullable: false },
          { name: "description", type: "text", nullable: true },
          { name: "button_actions", type: "jsonb", nullable: true },
          { name: "created_at", type: "timestamptz", nullable: false, default: "now()" },
          { name: "updated_at", type: "timestamptz", nullable: false, default: "now()" }
        ],
        indexes: [
          { name: "idx_elements_project", columns: ["project_id"] },
          { name: "idx_elements_element_id", columns: ["element_id"] }
        ]
      }
    ]
  };
}

function buildDatabaseSQL(projectId: string) {
  return `-- projects table
create table if not exists projects (
  project_id text primary key,
  project_name text not null
);

-- elements table
create table if not exists elements (
  id bigserial primary key,
  project_id text not null references projects(project_id) on delete cascade,
  type text not null check (type in ('page','form','button','form_field')),
  element_id text not null,
  display_name text not null,
  description text,
  button_actions jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_elements_project
  on elements(project_id);

create index if not exists idx_elements_element_id
  on elements(element_id);
`;
}

// --- Prompt + Spec builders ------------------------------------------

function buildAiBuilderPrompt(projectId: string, elements: SweetboxElement[]) {
  const pages = elements.filter((e) => e.type === "page");
  const forms = elements.filter((e) => e.type === "form");
  const buttons = elements.filter((e) => e.type === "button");

  const lines: string[] = [];
  lines.push("You are an app builder. Create an application called SweetBox.");
  lines.push(`Project ID: ${projectId}`);
  lines.push("");

  lines.push("PAGES:");
  if (pages.length === 0) lines.push("  (no pages yet)");
  else pages.forEach((p) => lines.push(`  - ${p.element_id}: ${p.description || "(no description)"}`));
  lines.push("");

  lines.push("FORMS:");
  if (forms.length === 0) lines.push("  (no forms yet)");
  else forms.forEach((f) => lines.push(`  - ${f.element_id}: ${f.description || "(no description)"}`));
  lines.push("");

  lines.push("BUTTONS:");
  if (buttons.length === 0) lines.push("  (no buttons yet)");
  else buttons.forEach((b) => {
    lines.push(`  - ${b.element_id}: ${b.description || "(no description)"}`);
    const actionLines = describeActions(b.button_actions || []);
    actionLines.forEach((al) => lines.push(al));
  });
  lines.push("");
  lines.push("Build the UI screens, navigation, and state handling according to this spec.");

  return lines.join("\\n");
}

function buildDeveloperSpec(projectId: string, elements: SweetboxElement[]) {
  return {
    project: {
      id: projectId,
      name: "SweetBox",
      goal: "Compile project spec into AI builder prompt + developer spec.",
      audience: "Product owners / internal tool builders",
      default_route: "page_dashboard"
    },
    pages: elements.filter((e) => e.type === "page").map((e) => ({
      id: e.element_id,
      label: e.display_name,
      description: e.description,
      layout_content: null,
      visibility: null
    })),
    forms: elements.filter((e) => e.type === "form").map((e) => ({
      id: e.element_id,
      label: e.display_name,
      description: e.description,
      standard_behavior: {
        paginate_max_fields: 10,
        include_prev_next: true,
        include_save_progress: true,
        include_submit: true
      },
      form_fields: [],
      on_submit: null,
      post_submit: null,
      visibility: null
    })),
    buttons: elements.filter((e) => e.type === "button").map((e) => ({
      id: e.element_id,
      label: e.display_name,
      description: e.description,
      placement: null,
      actions: e.button_actions || [],
      visibility: null
    })),
    // <-- NEW: database model for backend devs
    database: buildDatabaseModel(projectId, elements)
  };
}

function buildMachineRegistry(projectId: string, elements: SweetboxElement[]) {
  return {
    project_id: projectId,
    snapshot: elements
  };
}

// --- GET /api/compile -------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("project_id") || "";
    if (!projectId) return errorResponse("Missing project_id", 400);

    const allForProject = listElements(projectId);

    const ai_builder_prompt = buildAiBuilderPrompt(projectId, allForProject);
    const developer_spec = buildDeveloperSpec(projectId, allForProject);
    const machine_registry = buildMachineRegistry(projectId, allForProject);

    // <-- NEW: db_sql_schema (runnable migration for Supabase/Postgres)
    const db_sql_schema = buildDatabaseSQL(projectId);

    return jsonResponse({
      ai_builder_prompt,
      developer_spec,
      machine_registry,
      db_sql_schema
    });
  } catch (err: any) {
    console.error("GET /api/compile error:", err);
    return errorResponse("Internal Server Error (/api/compile)", 500);
  }
}
