// lib/memoryStore.ts
export type ProjectInfo = { project_id: string; project_name: string };
export type ElementInfo = {
  project_id: string;
  type: 'page' | 'form' | 'button';
  element_id: string;
  display_name: string;
  description: string;
};

const _projects: ProjectInfo[] = [
  { project_id: 'sweetbox_001', project_name: 'SweetBox' },
];

const _elements: ElementInfo[] = [
  {
    project_id: 'sweetbox_001',
    type: 'page',
    element_id: 'page_dashboard',
    display_name: 'Dashboard',
    description: 'Main dashboard with metrics and quick actions',
  },
  {
    project_id: 'sweetbox_001',
    type: 'button',
    element_id: 'btn_save',
    display_name: 'Save',
    description: 'Save current progress',
  },
];

export function listProjects(): ProjectInfo[] { return _projects; }
export function listElements(projectId: string): ElementInfo[] {
  return _elements.filter((e) => e.project_id === projectId);
}
