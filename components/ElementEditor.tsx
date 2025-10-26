// components/ElementEditor.tsx
"use client";

import { useState } from "react";

type Props = {
  onCreated?: () => void;
};

export default function ElementEditor({ onCreated }: Props) {
  const [open, setOpen] = useState(false);

  const [elementType, setElementType] = useState<"page"|"form"|"button">("page");
  const [elementId, setElementId] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveElement() {
    setSaving(true);
    setErrorMsg("");

    const payload = {
      project_id: "sweetbox_001",
      element_id: elementId,
      name,
      description: desc
    };

    let url = "";
    if (elementType === "page") url = "/api/pages";
    if (elementType === "form") url = "/api/forms";
    if (elementType === "button") url = "/api/buttons";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save element");
      }

      // reset form
      setElementId("");
      setName("");
      setDesc("");

      setSaving(false);
      setOpen(false);

      if (onCreated) {
        onCreated();
      }
    } catch (err: any) {
      setSaving(false);
      setErrorMsg(err.message || "Error saving element");
    }
  }

  return (
    <div className="text-sm">
      <button
        onClick={() => { setOpen(true); setErrorMsg(""); }}
        className="text-sm px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-black"
      >
        + Add Element
      </button>

      {open ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 flex flex-col gap-4">
            <header className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold text-gray-900">
                  New Element
                </div>
                <div className="text-xs text-gray-500">
                  Create a Page, Form, or Button in this project.
                </div>
              </div>
              <button
                className="text-xs text-gray-500 hover:text-gray-900"
                onClick={() => { setOpen(false); setErrorMsg(""); }}
              >
                Close
              </button>
            </header>

            <div className="flex flex-col gap-2 text-xs">
              <label className="text-xs font-medium text-gray-700">
                Element type
              </label>
              <select
                value={elementType}
                onChange={(e) =>
                  setElementType(e.target.value as "page"|"form"|"button")
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="page">Page</option>
                <option value="form">Form</option>
                <option value="button">Button</option>
              </select>

              <label className="text-xs font-medium text-gray-700">
                Element Name / ID (e.g. page_dashboard)
              </label>
              <input
                value={elementId}
                onChange={(e) => setElementId(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                placeholder="page_dashboard"
              />

              <label className="text-xs font-medium text-gray-700">
                Display Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                placeholder="Dashboard"
              />

              <label className="text-xs font-medium text-gray-700">
                Description / Purpose
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border rounded px-2 py-1 text-sm min-h-[60px]"
                placeholder="Main dashboard with metrics and quick actions"
              />

              {errorMsg ? (
                <p className="text-red-600 text-xs whitespace-pre-wrap">
                  {errorMsg}
                </p>
              ) : null}
            </div>

            <footer className="flex items-center justify-between pt-2">
              <button
                onClick={() => { setOpen(false); setErrorMsg(""); }}
                className="text-xs px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveElement}
                disabled={saving}
                className="text-xs px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Element"}
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}