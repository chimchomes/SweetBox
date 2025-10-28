import DashboardPanel from "@/components/DashboardPanel";

export default function HomePage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">SweetBox</h1>
      <p className="text-sm text-gray-600">
        SweetBox compiles your UI elements into an AI Builder Prompt and Developer Spec.
      </p>
      <DashboardPanel />
    </main>
  );
}