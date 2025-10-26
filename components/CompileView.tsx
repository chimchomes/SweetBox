// components/CompileView.tsx
"use client";

import { useState } from "react";

export default function CompileView() {
  const [projectId, setProjectId] = useState<string>("sweetbox_001");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleCompile() {
    try {
      setLoading(true);
      const res = await fetch(`/api/compile?project_id=${projectId}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Compile failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Export / Compile</h2>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-600 font-medium">
          Project ID for export
        </label>
        <input
          className="text-sm bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-gray-800"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
      </div>

      <button
        className="text-sm font-medium bg-purple-600 text-white rounded-lg px-3 py-2 disabled:opacity-50"
        onClick={handleCompile}
        disabled={loading}
      >
        {loading ? "Compiling..." : "Generate Prompt / Spec"}
      </button>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-[11px] text-gray-700 whitespace-pre-wrap max-h-40 overflow-auto">
        {result ? JSON.stringify(result, null, 2) : "No output yet."}
      </div>
    </section>
  );
}
