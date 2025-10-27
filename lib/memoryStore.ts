// lib/memoryStore.ts
import type { ButtonAction } from "./actions";

export type ProjectInfo = {
  project_id: string;
  project_name: string;
};

export type ElementInfo = {
  project_id: string;
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description: string;
  button_actions?: ButtonAction[];
};

const _projects: ProjectInfo[] = [
  { project_id: "sweetbox_001", project_name: "SweetBox" },
];

const _elements: ElementInfo[] = [
  {
    project_id: "sweetbox_001",
    type: "page",
    element_id: "page_dashboard",
    display_name: "Dashboard",
    description: "Main dashboard with metrics and quick actions",
  },
  {
    project_id: "sweetbox_001",
    type: "button",
    element_id: "btn_save",
    display_name: "Save",
    description: "Save current progress",
    button_actions: [
      {
        action_type: "save_progress",
        details: "Persist current draft data for the user without final submit",
      },
    ],
  },
  {
    project_id: "sweetbox_001",
    type: "button",
    element_id: "btn_go_dashboard",
    display_name: "Go to Dashboard",
    description: "Navigate user back to main dashboard",
    button_actions: [
      {
        action_type: "navigate",
        target: "page_dashboard",
        details: "Route the user to page_dashboard",
      },
    ],
  },
];

export function listProjects(): ProjectInfo[] {
  return _projects;
}

export function listElements(projectId: string): ElementInfo[] {
  return _elements.filter((e) => e.project_id === projectId);
}

export function updateElementDescription(
  projectId: string,
  element_id: string,
  newDescription: string
): boolean {
  const match = _elements.find(
    (e) => e.project_id === projectId && e.element_id === element_id
  );
  if (!match) return false;
  match.description = newDescription;
  return true;
}
