// components/ElementList.tsx
"use client";

import { useState } from "react";

export default function ElementList() {
  // Stub data until Supabase is wired in
  const [elements] = useState([
    {
      type: "page",
      id: "page_dashboard",
      description: "Main dashboard with metrics and quick actions",
    },
    {
      type: "form",
      id: "form_project_create",
      description: "Form to create a new project with title/description",
    },
    {
      type: "button",
      id: "btn_new_project",
      description: "Opens modal to create project",
    },
  ]);

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Elements in Project</h2>
        <button className="bg-gray-900 text-white text-[12px] leading-none px-3 py-2 rounded-lg font-medium">
          + Add Element
        </button>
      </header>

      <div className="flex flex-col gap-2">
        {elements.map((el) => (
          <div
            key={el.id}
            className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col gap-1"
          >
            <div className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <span className="inline-block rounded-md bg-purple-100 text-purple-700 text-[10px] px-2 py-[2px] uppercase font-bold">
                {el.type}
              </span>
              <span>{el.id}</span>
            </div>
            <div className="text-[11px] text-gray-600 leading-snug">
              {el.description}
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
