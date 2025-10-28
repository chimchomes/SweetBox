"use client";
import { useEffect, useState } from "react";
import EditableElementCard from "./EditableElementCard";

type ProjectRow = {
  project_id: string;
  project_name: string;
};

type ElementRow = {
  project_id: string;
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description?: string | null;
  button_actions?: any[] | null;
};

export default function DashboardPanel() {
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [pages, setPages] = useState<ElementRow[]>([]);
  const [forms, setForms] = useState<ElementRow[]>([]);
  const [buttons, setButtons] = useState<ElementRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadError(null);
        const projRes = await fetch("/api/projects");
        if (!projRes.ok) throw new Error("projects fetch failed");
        const projJson = await projRes.json();
        const first = Array.isArray(projJson.projects) && projJson.projects.length ? projJson.projects[0] : null;
        if (!first) {
          if (!cancelled) {
            setProject(null);
            setPages([]);
            setForms([]);
            setButtons([]);
          }
          return;
        }
        if (!cancelled) setProject(first);
        const compRes = await fetch(`/api/compile?project_id=${encodeURIComponent(first.project_id)}`);
        if (!compRes.ok) throw new Error("compile fetch failed");
        const compJson = await compRes.json();
        const devSpec = compJson.developer_spec || {};
        const p = Array.isArray(devSpec.pages) ? devSpec.pages : [];
        const f = Array.isArray(devSpec.forms) ? devSpec.forms : [];
        const b = Array.isArray(devSpec.buttons) ? devSpec.buttons : [];
        if (!cancelled) {
          setPages(p.map((row: any) => ({ project_id: first.project_id, type: "page", element_id: row.id, display_name: row.label, description: row.description || null })));
          setForms(f.map((row: any) => ({ project_id: first.project_id, type: "form", element_id: row.id, display_name: row.label, description: row.description || null })));
          setButtons(b.map((row: any) => ({ project_id: first.project_id, type: "button", element_id: row.id, display_name: row.label, description: row.description || null, button_actions: row.actions || [] })));
        }
      } catch (err: any) {
        console.error(err);
        if (!cancelled) setLoadError(err.message || "Load error");
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="bg-white shadow-card rounded-xl p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
        {!project ? (
          <p className="text-gray-500 text-sm">No projects yet.</p>
        ) : (
          <div className="border rounded-lg p-4 bg-white">
            <div className="text-lg font-semibold text-gray-900">{project.project_name}</div>
            <div className="text-xs text-gray-500 break-all">{project.project_id}</div>
          </div>
        )}
        {loadError && <div className="mt-4 text-xs text-red-600 border border-red-200 bg-red-50 rounded p-2">{loadError}</div>}
      </section>

      <section className="bg-white shadow-card rounded-xl p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Flow Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-900 uppercase mb-2">Pages</div>
            {pages.length === 0 ? <p className="text-gray-400 text-sm italic">No pages yet</p> : <div className="space-y-3">{pages.map((p) => <EditableElementCard key={p.element_id} element={{ project_id: p.project_id, type: "page", element_id: p.element_id, display_name: p.display_name, description: p.description }} />)}</div>}
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900 uppercase mb-2">Forms</div>
            {forms.length === 0 ? <p className="text-gray-400 text-sm italic">No forms yet</p> : <div className="space-y-3">{forms.map((f) => <EditableElementCard key={f.element_id} element={{ project_id: f.project_id, type: "form", element_id: f.element_id, display_name: f.display_name, description: f.description }} />)}</div>}
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900 uppercase mb-2">Buttons</div>
            {buttons.length === 0 ? <p className="text-gray-400 text-sm italic">No buttons yet</p> : <div className="space-y-3">{buttons.map((b) => <EditableElementCard key={b.element_id} element={{ project_id: b.project_id, type: "button", element_id: b.element_id, display_name: b.display_name, description: b.description, button_actions: b.button_actions || [] }} />)}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}