// lib/compile.ts
import { describeActions } from '@/lib/actions'

export type SweetboxElementRow = {
  project_id: string;
  type: 'page' | 'form' | 'button' | 'form_field';
  element_id: string;
  display_name: string;
  description: string | null;
  button_actions: any[] | null;
};

export function buildDatabaseModel() {
  return {
    provider: 'supabase',
    tables: [
      {
        name: 'projects',
        description: 'Top-level SweetBox projects',
        columns: [
          { name: 'project_id', type: 'text', primary_key: true, nullable: false },
          { name: 'project_name', type: 'text', nullable: false }
        ]
      },
      {
        name: 'elements',
        description: 'Pages, Forms, Buttons defined by the user',
        columns: [
          { name: 'id', type: 'bigserial', primary_key: true, nullable: false, generated: 'identity' },
          { name: 'project_id', type: 'text', nullable: false, references: 'projects.project_id' },
          { name: 'type', type: 'text', nullable: false },
          { name: 'element_id', type: 'text', nullable: false },
          { name: 'display_name', type: 'text', nullable: false },
          { name: 'description', type: 'text', nullable: true },
          { name: 'button_actions', type: 'jsonb', nullable: true },
          { name: 'created_at', type: 'timestamptz', nullable: false, default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', nullable: false, default: 'now()' }
        ],
        indexes: [
          { name: 'idx_elements_project', columns: ['project_id'] },
          { name: 'idx_elements_element_id', columns: ['element_id'] }
        ]
      }
    ]
  }
}

export function buildDatabaseSQL() {
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

export function buildAiBuilderPrompt(projectId: string, elements: SweetboxElementRow[]) {
  const pages    = elements.filter((e) => e.type === 'page');
  const forms    = elements.filter((e) => e.type === 'form');
  const buttons  = elements.filter((e) => e.type === 'button');

  const lines: string[] = [];
  lines.push('You are an app builder. Create an application called SweetBox.');
  lines.push(`Project ID: ${projectId}`);
  lines.push('');

  lines.push('PAGES:');
  if (pages.length === 0) lines.push('  (no pages yet)');
  else pages.forEach((p) => lines.push(`  - ${p.element_id}: ${p.description || '(no description)'}`));
  lines.push('');

  lines.push('FORMS:');
  if (forms.length === 0) lines.push('  (no forms yet)');
  else forms.forEach((f) => lines.push(`  - ${f.element_id}: ${f.description || '(no description)'}`));
  lines.push('');

  lines.push('BUTTONS:');
  if (buttons.length === 0) lines.push('  (no buttons yet)');
  else buttons.forEach((b) => {
    lines.push(`  - ${b.element_id}: ${b.description || '(no description)'}`);
    const actionLines = describeActions((b.button_actions || []) as any[]);
    actionLines.forEach((al) => lines.push(al));
  });
  lines.push('');
  lines.push('Build the UI screens, navigation, and state handling according to this spec.');

  return lines.join('\n');
}

export function buildDeveloperSpec(
  projectId: string,
  elements: SweetboxElementRow[],
  projectMeta: any | null
) {
  return {
    project: {
      id: projectId,
      name: projectMeta?.project_name ?? 'SweetBox',
      goal: projectMeta?.app_goal ?? 'Compile project spec into AI builder prompt + developer spec.',
      audience: projectMeta?.audience ?? 'Product owners / internal tool builders',
      default_route: projectMeta?.default_route ?? 'page_dashboard'
    },
    pages: elements
      .filter((e) => e.type === 'page')
      .map((e) => ({
        id: e.element_id,
        label: e.display_name,
        description: e.description,
        layout_content: null,
        visibility: null
      })),
    forms: elements
      .filter((e) => e.type === 'form')
      .map((e) => ({
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
    buttons: elements
      .filter((e) => e.type === 'button')
      .map((e) => ({
        id: e.element_id,
        label: e.display_name,
        description: e.description,
        placement: null,
        actions: e.button_actions || [],
        visibility: null
      })),
    database: buildDatabaseModel()
  };
}

export function buildMachineRegistry(projectId: string, elements: SweetboxElementRow[]) {
  return {
    project_id: projectId,
    snapshot: elements
  };
}

export async function loadProjectAndElements(supabase: any, projectId: string) {
  const { data: projectRows, error: projErr } = await supabase
    .from('projects')
    .select('project_id, project_name, app_goal, audience, default_route')
    .eq('project_id', projectId)
    .limit(1)
  if (projErr) throw projErr
  const projectMeta = projectRows && projectRows[0] ? projectRows[0] : null

  const { data: elemRows, error: elemErr } = await supabase
    .from('elements')
    .select('*')
    .eq('project_id', projectId)
    .order('id', { ascending: true })
  if (elemErr) throw elemErr

  return { projectMeta, elements: (elemRows || []) as SweetboxElementRow[] }
}
