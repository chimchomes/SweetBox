"use client";
import { useState } from "react";

type SBElement = {
  id?: number;
  project_id: string;
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description?: string | null;
  button_actions?: any[] | null;
};

type EditableElementCardProps = {
  element: SBElement;
};

export default function EditableElementCard({ element }: EditableElementCardProps) {
  const [displayName, setDisplayName] = useState(element.display_name || "");
  const [description, setDescription] = useState(element.description || "");
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setInfo("Saving...");
    try {
      const route =
        element.type === "page"
          ? "/api/pages"
          : element.type === "form"
          ? "/api/forms"
          : "/api/buttons";

      const body: any = {
        project_id: element.project_id,
        element_id: element.element_id,
        display_name: displayName,
        description,
      };
      if (element.type === "button") body.button_actions = element.button_actions || [];

      const res = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) setInfo("Save failed");
      else setInfo("Saved");
    } catch (err) {
      console.error("Save error:", err);
      setInfo("Save failed (exception)");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border rounded-lg bg-white shadow-card p-4 text-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
          {element.type}
        </div>
        {info && <div className="text-[11px] text-gray-500">{info}</div>}
      </div>

      <div>
        <div className="text-[11px] text-gray-400">Element ID</div>
        <div className="font-mono text-xs text-gray-800 break-all">{element.element_id}</div>
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] text-gray-500 uppercase">Display Name</label>
        <input className="w-full border rounded px-2 py-1 text-sm bg-white" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] text-gray-500 uppercase">Description / Purpose</label>
        <textarea className="w-full border rounded px-2 py-1 text-sm bg-white min-h-[60px]" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {element.type === "button" && (
        <div className="space-y-1">
          <label className="block text-[11px] text-gray-500 uppercase">Actions (read-only)</label>
          <pre className="bg-gray-50 border rounded p-2 text-[11px] leading-tight max-h-32 overflow-auto whitespace-pre-wrap">{JSON.stringify(element.button_actions || [], null, 2)}</pre>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className={`px-3 py-1 rounded text-white text-xs font-medium ${saving ? "bg-gray-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"}`}>
          {saving ? "Savingâ€¦" : "Save"}
        </button>
      </div>
    </div>
  );
}