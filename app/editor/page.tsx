// app/editor/page.tsx
'use client'

import ElementList from '@/components/ElementList'

export default function EditorPage() {
  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Project Elements Editor</h1>
        <p className="text-gray-600 text-sm mt-2">
          Edit element descriptions inline. Changes are applied to memoryStore instantly.
        </p>
      </header>

      <section className="bg-white p-4 rounded-xl shadow-card border border-gray-200">
        <ElementList />
      </section>
    </main>
  )
}
