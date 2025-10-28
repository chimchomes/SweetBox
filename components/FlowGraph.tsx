"use client";
import { useEffect, useState } from "react";
type FlowData = { pages: any[]; forms: any[]; buttons: any[] };

export default function FlowGraph() {
  const [data, setData] = useState<FlowData>({ pages: [], forms: [], buttons: [] });
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/compile?project_id=sweetbox_001");
        if (!res.ok) throw new Error("compile fetch failed");
        const json = await res.json();
        setData(json.developer_spec || { pages: [], forms: [], buttons: [] });
      } catch (err) {
        console.error("FlowGraph fetch error", err);
      }
    }
    load();
  }, []);
  const sections: (keyof FlowData)[] = ["pages", "forms", "buttons"];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {sections.map((type) => (
        <div key={type}>
          <h3 className="font-bold mb-2 capitalize text-indigo-700">{type}</h3>
          <ul className="space-y-1">
            {data[type].map((item: any) => (
              <li key={item.id} className="p-2 bg-white border rounded shadow-sm">
                <div className="font-medium">{item.label}</div>
                <div className="text-[11px] text-gray-500 break-all">{item.id}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}