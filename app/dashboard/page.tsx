'use client'
import FlowGraph from '@/components/FlowGraph'
import LoaderPanel from '@/components/LoaderPanel'

export default function DashboardPage() {
  return (
    <main className='p-6 space-y-6'>
      <h1 className='text-3xl font-semibold'>SweetBox Project Dashboard</h1>
      <section className='grid gap-6 lg:grid-cols-2'>
        <LoaderPanel />
        <FlowGraph />
      </section>
    </main>
  )
}
