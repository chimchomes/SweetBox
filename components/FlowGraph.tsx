'use client'
import { useEffect, useState } from 'react'

export default function FlowGraph() {
  const [data, setData] = useState<{pages:any[], forms:any[], buttons:any[]}>({pages:[], forms:[], buttons:[]})

  useEffect(() => {
    fetch('/api/compile?project_id=sweetbox_001')
      .then(r => r.json())
      .then(d => {
        const spec = d.developer_spec || {pages:[], forms:[], buttons:[]}
        setData({pages: spec.pages || [], forms: spec.forms || [], buttons: spec.buttons || []})
      })
      .catch(() => setData({pages:[], forms:[], buttons:[]}))
  }, [])

  return (
    <section className='bg-white p-4 rounded-xl shadow-card border border-gray-200'>
      <h2 className='text-xl font-semibold mb-4'>Flow Overview</h2>
      <div className='grid gap-6 md:grid-cols-3 text-sm'>
        {['pages','forms','buttons'].map((type) => (
          <div key={type}>
            <h3 className='font-bold mb-2'>{type.toUpperCase()}</h3>
            <ul className='space-y-1'>
              {data[type].map((item:any) => (
                <li key={item.id} className='p-2 bg-white border rounded shadow-sm'>
                  <div className='font-medium'>{item.label}</div>
                  <div className='text-[11px] text-gray-500 break-all'>{item.id}</div>
                </li>
              ))}
              {data[type].length === 0 && <li className='text-gray-400 text-[12px] italic'>No {type} yet</li>}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
