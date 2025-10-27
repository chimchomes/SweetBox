-- projects table
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
