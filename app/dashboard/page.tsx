"use client";
import DashboardPanel from "@/components/DashboardPanel";
import FlowGraph from "@/components/FlowGraph";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">SweetBox Project Dashboard</h1>
      <section className="bg-white p-4 rounded-xl shadow-card">
        <DashboardPanel />
      </section>
      <section className="bg-white p-4 rounded-xl shadow-card">
        <h2 className="text-lg font-semibold mb-3">Flow</h2>
        <FlowGraph />
      </section>
    </main>
  );
}