'use client'
import { useState, useEffect } from 'react'

export default function LoaderPanel() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setProjects(data.projects || []))
      .catch(() => setProjects([]))
  }, [])

  return (
    <section className='bg-white p-4 rounded-xl shadow-card border border-gray-200'>
      <h2 className='text-xl font-semibold mb-2'>Projects</h2>
      {projects.length === 0 && <p className='text-gray-500 text-sm'>No projects yet.</p>}
      <ul className='space-y-2'>
        {projects.map(p => (
          <li key={p.project_id} className='p-2 border rounded hover:bg-gray-50 text-sm leading-snug'>
            <div className='font-medium text-gray-900'>{p.project_name}</div>
            <div className='text-gray-500 text-[11px]'>{p.project_id}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
