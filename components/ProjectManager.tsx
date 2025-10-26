// components/ProjectManager.tsx
"use client";

import { useState } from "react";

export default function ProjectManager() {
  const [appName, setAppName] = useState("SweetBox");
  const [appGoal, setAppGoal] = useState(
    "Compile project spec into AI builder prompt + developer spec."
  );
  const [audience, setAudience] = useState("Product owners / internal tool builders");

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Project Info</h2>
        <span className="text-[11px] text-gray-400">Draft</span>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600 font-medium">App Name</label>
          <input
            className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-800"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs text-gray-600 font-medium">Goal / Purpose</label>
          <input
            className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-800"
            value={appGoal}
            onChange={(e) => setAppGoal(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Audience / Persona</label>
        <input
          className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-800"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>

      <div className="text-[11px] text-gray-500 leading-snug">
        This info will be included in:
        <ul className="list-disc ml-4">
          <li>AI Builder Prompt export</li>
          <li>Developer Spec export</li>
        </ul>
      </div>
    </section>
  );
}
