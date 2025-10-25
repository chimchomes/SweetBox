// lib/types.ts
// Shared TypeScript interfaces used across API routes

export interface ProjectRow {
  id: string;
  project_id: string;
  project_name: string;
  app_goal: string | null;
  audience: string | null;
  default_route: string | null;
  design_tokens: any;
  created_at: string;
  updated_at: string;
}

export interface PageRow {
  id: string;
  project_id: string;
  element_id: string;
  name: string;
  description: string | null;
  layout_content: string | null;
  visibility: any;
  created_at: string;
  updated_at: string;
}

export interface FormRow {
  id: string;
  project_id: string;
  element_id: string;
  name: string;
  description: string | null;
  standard_behavior: any;
  on_submit: any;
  post_submit: any;
  visibility: any;
  created_at: string;
  updated_at: string;
}

export interface ButtonRow {
  id: string;
  project_id: string;
  element_id: string;
  name: string;
  description: string | null;
  placement: any;
  visibility: any;
  created_at: string;
  updated_at: string;
}
