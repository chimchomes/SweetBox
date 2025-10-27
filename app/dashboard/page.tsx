'use client'

import DashboardPanel from '@/components/DashboardPanel'

export default function DashboardPage() {
  return (
    <main className="p-6 min-h-screen bg-gray-100 text-gray-900 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900">
        SweetBox Project Dashboard
      </h1>
      <DashboardPanel />
    </main>
  )
}
