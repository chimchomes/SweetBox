"use client";

import { useEffect, useState } from "react";

type Element = {
  type: "page" | "form" | "button";
  element_id: string;
  description: string;
  display_name?: string;
};

export default function ElementList() {
  const PROJECT_ID = "sweetbox_001";
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadElements() {
    setLoading(true);
    setError(null);
    try {
      const [pagesRes, formsRes, buttonsRes] = await Promise.all([
        fetch(`/api/pages?project_id=${PROJECT_ID}`),
        fetch(`/api/forms?project_id=${PROJECT_ID}`),
        fetch(`/api/buttons?project_id=${PROJECT_ID}`)
      ]);

      const [pagesJson, formsJson, buttonsJson] = await Promise.all([
        pagesRes.json().catch(() => ({ data: [] })),
        formsRes.json().catch(() => ({ data: [] })),
        buttonsRes.json().catch(() => ({ data: [] }))
      ]);

      const pages = Array.isArray(pagesJson.data) ? pagesJson.data : [];
      const forms = Array.isArray(formsJson.data) ? formsJson.data : [];
      const buttons = Array.isArray(buttonsJson.data) ? buttonsJson.data : [];

      setElements([
        ...pages.map((p) => ({ ...p, type: "page" })),
        ...forms.map((f) => ({ ...f, type: "form" })),
        ...buttons.map((b) => ({ ...b, type: "button" }))
      ]);
    } catch (err: any) {
      setError("Failed to load elements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadElements();
  }, []);

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Elements in Project</h2>
        <button
          onClick={loadElements}
          className="bg-gray-900 text-white text-[12px] leading-none px-3 py-2 rounded-lg font-medium"
        >
          Refresh
        </button>
      </header>

      {loading && <p className="text-xs text-gray-500">Loading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}

      {!loading && !error && elements.length === 0 && (
        <div className="text-xs text-gray-500">No elements found.</div>
      )}

      <div className="flex flex-col gap-2">
        {elements.map((el) => (
          <div
            key={`${el.type}-${el.element_id}`}
            className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col gap-1"
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

      <div className="text-[11px] text-gray-500 leading-snug">
        Elements come from Pages, Forms, and Buttons you define.  
        Later you’ll be able to edit, attach, and set actions here.
      </div>
    </section>
  );
}
