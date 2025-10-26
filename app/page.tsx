"use client";

import { useEffect, useState } from "react";

type ElementRecord = {
  project_id: string;
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description: string;
};

type DraftElement = {
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description: string;
};

export default function DashboardPage() {
  const PROJECT_ID = "sweetbox_001";

  // project info
  const [appName, setAppName] = useState("SweetBox");
  const [appGoal, setAppGoal] = useState(
    "Compile project spec into AI builder prompt + developer spec."
  );
  const [audience, setAudience] = useState(
    "Product owners / internal tool builders"
  );

  // elements list
  const [elements, setElements] = useState<ElementRecord[]>([]);
  const [elementsError, setElementsError] = useState<string | null>(null);
  const [isLoadingElements, setIsLoadingElements] = useState<boolean>(false);

  // compile/export
  const [compileOutput, setCompileOutput] = useState<any>(null);
  const [compileLoading, setCompileLoading] = useState<boolean>(false);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const [draft, setDraft] = useState<DraftElement>({
    type: "page",
    element_id: "",
    display_name: "",
    description: "",
  });

  // load elements from backend
  async function loadElements() {
    setIsLoadingElements(true);
    setElementsError(null);

    try {
      const [pagesRes, formsRes, buttonsRes] = await Promise.all([
        fetch(`/api/pages?project_id=${PROJECT_ID}`),
        fetch(`/api/forms?project_id=${PROJECT_ID}`),
        fetch(`/api/buttons?project_id=${PROJECT_ID}`),
      ]);

      const [pagesJson, formsJson, buttonsJson] = await Promise.all([
        pagesRes.json().catch(() => ({ data: [] })),
        formsRes.json().catch(() => ({ data: [] })),
        buttonsRes.json().catch(() => ({ data: [] })),
      ]);

      const pagesArr = Array.isArray(pagesJson?.data) ? pagesJson.data : [];
      const formsArr = Array.isArray(formsJson?.data) ? formsJson.data : [];
      const buttonsArr = Array.isArray(buttonsJson?.data)
        ? buttonsJson.data
        : [];

      const merged = [
        ...pagesArr,
        ...formsArr,
        ...buttonsArr,
      ] as ElementRecord[];

      setElements(merged);
    } catch (err: any) {
      setElementsError("Could not load elements from backend. (check API routes)");
      setElements([]);
    } finally {
      setIsLoadingElements(false);
    }
  }

  useEffect(() => {
    loadElements();
  }, []);

  // save new element
  async function handleSaveElement() {
    setSaveError(null);
    setSaving(true);

    let endpoint = "";
    if (draft.type === "page") endpoint = "/api/pages";
    else if (draft.type === "form") endpoint = "/api/forms";
    else if (draft.type === "button") endpoint = "/api/buttons";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: PROJECT_ID,
          element_id: draft.element_id,
          display_name: draft.display_name,
          description: draft.description,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setSaveError(data?.error || "Save failed.");
        setSaving(false);
        return;
      }

      // success
      setShowModal(false);
      setSaving(false);
      setDraft({
        type: "page",
        element_id: "",
        display_name: "",
        description: "",
      });

      await loadElements();
    } catch (err: any) {
      setSaveError("Save failed (network/server).");
      setSaving(false);
    }
  }

  // compile/export
  async function handleCompile() {
    setCompileLoading(true);
    try {
      const res = await fetch(
        `/api/compile?project_id=${encodeURIComponent(PROJECT_ID)}`
      );
      const json = await res.json().catch(() => null);
      setCompileOutput(json);
    } catch (err: any) {
      setCompileOutput({ error: "Compile failed." });
    } finally {
      setCompileLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* PROJECT INFO */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-card p-4 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <h2 className="text-base font-semibold text-gray-800">
                Project Info
              </h2>
              <span className="text-[11px] text-gray-400">Draft</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">
                  App Name
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-gray-800"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">
                  Goal / Purpose
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-gray-800"
                  value={appGoal}
                  onChange={(e) => setAppGoal(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <label className="text-xs text-gray-600 font-medium">
                Audience / Persona
              </label>
              <input
                className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-gray-800"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            <div className="text-[11px] text-gray-500 leading-snug border-t border-gray-200 pt-3">
              This info will be included in:
              <ul className="list-disc ml-4">
                <li>AI Builder Prompt export</li>
                <li>Developer Spec export</li>
              </ul>
            </div>
          </section>

          {/* ELEMENTS LIST */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-card p-4 flex flex-col gap-3">
            <header className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">
                Elements in Project
              </h2>
              <button
                className="bg-gray-900 text-white text-[12px] leading-none px-3 py-2 rounded-lg font-medium"
                onClick={() => {
                  setSaveError(null);
                  setSaving(false);
                  setDraft({
                    type: "page",
                    element_id: "",
                    display_name: "",
                    description: "",
                  });
                  setShowModal(true);
                }}
              >
                + Add Element
              </button>
            </header>

            {elementsError && (
              <div className="text-[12px] text-red-600">{elementsError}</div>
            )}

            {!elementsError && isLoadingElements && (
              <div className="text-[12px] text-gray-500">
                Loading elements...
              </div>
            )}

            {!elementsError && !isLoadingElements && elements.length === 0 && (
              <div className="text-[13px] text-gray-600 border border-gray-200 rounded-lg bg-gray-50 p-3">
                No elements yet. Use "Add Element" to create a Page / Form /
                Button.
              </div>
            )}

            {!elementsError && !isLoadingElements && elements.length > 0 && (
              <div className="flex flex-col gap-3 text-sm">
                {elements.map((el: ElementRecord) => (
                  <div
                    key={el.type + ":" + el.element_id}
                    className="border border-gray-200 rounded-lg p-3 bg-white"
                  >
                    <div className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                      <span className="inline-block rounded-md bg-purple-100 text-purple-700 text-[10px] px-2 py-[2px] uppercase font-bold">
                        {el.type}
                      </span>
                      <span>{el.element_id}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 leading-snug">
                      {el.description || el.display_name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[11px] text-gray-500 leading-snug border-t border-gray-200 pt-3">
              Elements come from Pages, Forms, and Buttons you define. Later
              you’ll be able to edit fields, attach forms, attach actions, and
              set redirects here.
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <section className="bg-white border border-gray-200 rounded-xl shadow-card p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">
                Export / Compile
              </h2>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <label className="text-xs text-gray-600 font-medium">
                Project ID for export
              </label>
              <input
                className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-gray-800 text-sm"
                value={PROJECT_ID}
                disabled
              />
            </div>

            <button
              className="text-sm font-medium bg-indigo-600 text-white rounded-lg px-3 py-2 disabled:opacity-50"
              onClick={handleCompile}
              disabled={compileLoading}
            >
              {compileLoading ? "Compiling..." : "Generate Prompt / Spec"}
            </button>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-[11px] text-gray-700 whitespace-pre-wrap max-h-40 overflow-auto">
              {compileOutput
                ? JSON.stringify(compileOutput, null, 2)
                : "No output yet."}
            </div>
          </section>
        </div>
      </div>

      <footer className="text-center text-[11px] text-gray-400 mt-8">
        SweetBox • Phase 5 Element Editing
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-card w-full max-w-lg text-gray-900">
            <div className="flex items-start justify-between p-4 border-b border-gray-200">
              <div>
                <div className="text-base font-semibold text-gray-900">
                  New Element
                </div>
                <div className="text-[12px] text-gray-500">
                  Create a Page, Form, or Button in this project.
                </div>
              </div>
              <button
                className="text-[12px] text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Close
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4 text-sm">
              {/* type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">
                  Element type
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-2 text-gray-800 text-sm"
                  value={draft.type}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      type: e.target.value as DraftElement["type"],
                    }))
                  }
                >
                  <option value="page">Page</option>
                  <option value="form">Form</option>
                  <option value="button">Button</option>
                </select>
              </div>

              {/* element id */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">
                  Element Name / ID (e.g. page_dashboard)
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-2 text-gray-800 text-sm"
                  value={draft.element_id}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, element_id: e.target.value }))
                  }
                />
              </div>

              {/* display name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">
                  Display Name
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-2 text-gray-800 text-sm"
                  value={draft.display_name}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, display_name: e.target.value }))
                  }
                />
              </div>

              {/* description */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">
                  Description / Purpose
                </label>
                <textarea
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-2 text-gray-800 text-sm min-h-[80px]"
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                />
              </div>

              {/* save error */}
              {saveError && (
                <div className="text-[12px] text-red-600 whitespace-pre-wrap">
                  {saveError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-200 text-sm">
              <button
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-50"
                onClick={handleSaveElement}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Element"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
