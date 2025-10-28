// lib/memoryStore.ts
// Simple in-memory store used as fallback in dev.
// Primary integration is Supabase; memoryStore is non-persistent.

type SBElement = {
  project_id: string;
  type: "page" | "form" | "button" | "form_field";
  element_id: string;
  display_name: string;
  description?: string | null;
  button_actions?: any[] | null;
  id?: number;
};

const _store: { projects: any[]; elements: SBElement[] } = {
  projects: [
    { project_id: "sweetbox_001", project_name: "SweetBox" }
  ],
  elements: [
    { project_id: "sweetbox_001", type: "page", element_id: "page_dashboard", display_name: "Dashboard", description: "Main dashboard", id: 1 }
  ]
};

export function listProjects() {
  return _store.projects;
}

export function listElements(projectId: string) {
  return _store.elements.filter(e => e.project_id === projectId);
}

export function addElement(elem: SBElement) {
  const nextId = (_store.elements.reduce((s, e) => Math.max(s, e.id || 0), 0) || 0) + 1;
  const copy = { ...elem, id: nextId };
  _store.elements.push(copy);
  return copy;
}

export function updateElement(id: number, patch: Partial<SBElement>) {
  const idx = _store.elements.findIndex(e => e.id === id);
  if (idx === -1) return null;
  _store.elements[idx] = { ..._store.elements[idx], ...patch };
  return _store.elements[idx];
}