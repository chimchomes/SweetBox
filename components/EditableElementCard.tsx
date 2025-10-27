// components/EditableElementCard.tsx
'use client'
import { useState } from 'react'

export default function EditableElementCard({ element }: any) {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(element.description || '')
  const [saving, setSaving] = useState(false)

  const saveChange = async () => {
    setSaving(true)
    await fetch(`/api/elements/${element.element_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: element.project_id, description: desc }),
    })
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className='p-3 bg-white shadow rounded border'>
      <div className='flex justify-between items-center'>
        <strong>{element.display_name}</strong>
        <button
          className='text-sm text-indigo-600'
          onClick={() => setEditing(!editing)}
        >
          ✏️ {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      {editing ? (
        <div className='mt-2 space-y-2'>
          <textarea
            className='w-full p-2 border rounded'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            className='bg-indigo-600 text-white px-3 py-1 rounded'
            disabled={saving}
            onClick={saveChange}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      ) : (
        <p className='text-gray-700 mt-2'>{element.description}</p>
      )}
    </div>
  )
}
