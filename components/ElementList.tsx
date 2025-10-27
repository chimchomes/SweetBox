// components/ElementList.tsx
'use client'
import { useEffect, useState } from 'react'
import EditableElementCard from './EditableElementCard'

export default function ElementList() {
  const [data, setData] = useState<any>({ pages: [], forms: [], buttons: [] })

  useEffect(() => {
    fetch('/api/compile?project_id=sweetbox_001')
      .then((r) => r.json())
      .then((d) => setData(d.developer_spec || { pages: [], forms: [], buttons: [] }))
  }, [])

  return (
    <div className='space-y-8'>
      <section>
        <h3 className='font-bold text-xl mb-3 text-indigo-700'>Pages</h3>
        <div className='grid gap-4 md:grid-cols-2'>
          {data.pages.map((p: any) => (
            <EditableElementCard key={p.id} element={{ ...p, project_id: 'sweetbox_001', type: 'page' }} />
          ))}
        </div>
      </section>
      <section>
        <h3 className='font-bold text-xl mb-3 text-pink-700'>Forms</h3>
        <div className='grid gap-4 md:grid-cols-2'>
          {data.forms.map((f: any) => (
            <EditableElementCard key={f.id} element={{ ...f, project_id: 'sweetbox_001', type: 'form' }} />
          ))}
        </div>
      </section>
      <section>
        <h3 className='font-bold text-xl mb-3 text-green-700'>Buttons</h3>
        <div className='grid gap-4 md:grid-cols-2'>
          {data.buttons.map((b: any) => (
            <EditableElementCard key={b.id} element={{ ...b, project_id: 'sweetbox_001', type: 'button' }} />
          ))}
        </div>
      </section>
    </div>
  )
}
