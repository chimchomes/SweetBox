"use client";
import EditableElementCard from "./EditableElementCard";

type ElementRow = {
  id?: number;
  project_id: string;
  type: "page" | "form" | "button";
  element_id: string;
  display_name: string;
  description?: string | null;
};

export default function ElementList({ pages }: { pages: ElementRow[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pages.map((p) => (
        <EditableElementCard key={p.element_id} element={{ ...p }} />
      ))}
    </div>
  );
}