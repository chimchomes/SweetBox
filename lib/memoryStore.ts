// lib/memoryStore.ts
// Temporary in-memory element store for SweetBox Phase 5.
// Persists across hot-reload using a global.

export type SweetboxElementType = "page" | "form" | "button";

export interface SweetboxElement {
  project_id: string;
  type: SweetboxElementType;
  element_id: string;
  display_name: string;
  description: string;
}

const globalAny = global as any;

// keep the store across hot reloads in dev
if (!globalAny.__SWEETBOX_STORE__) {
  globalAny.__SWEETBOX_STORE__ = {
    elements: [] as SweetboxElement[],
  };
}

const store = globalAny.__SWEETBOX_STORE__ as {
  elements: SweetboxElement[];
};

export function listElements(project_id: string, type?: SweetboxElementType) {
  return store.elements.filter(
    (el: SweetboxElement) =>
      el.project_id === project_id && (!type || el.type === type)
  );
}

export function addElement(data: SweetboxElement) {
  // dedupe by (project_id, type, element_id)
  const exists = store.elements.find(
    (el) =>
      el.project_id === data.project_id &&
      el.element_id === data.element_id &&
      el.type === data.type
  );
  if (!exists) {
    store.elements.push(data);
  }
  return data;
}
