// app/page.tsx
import ProjectManager from "@/components/ProjectManager";
import ElementList from "@/components/ElementList";
import CompileView from "@/components/CompileView";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProjectManager />
          <ElementList />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CompileView />
        </div>
      </div>
      <footer className="text-center text-[11px] text-gray-400 mt-8">
        SweetBox • Phase 4 UI Shell
      </footer>
    </main>
  );
}
