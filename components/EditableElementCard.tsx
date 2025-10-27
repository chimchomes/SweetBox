'use client'

import { useState } from 'react'

type EditableElementCardProps = {
  projectId: string
  elementId: string
  label: string
  description: string | null
  type: 'page' | 'form' | 'button'
}

export default function EditableElementCard({
  projectId,
  elementId,
  label,
  description,
  type,
}: EditableElementCardProps) {
  const [editing, setEditing] = useState(false)
  const [descDraft, setDescDraft] = useState(description ?? '')
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    try {
      setSaving(true)
      setStatus(null)
      const res = await fetch(
        `/api/elements/${encodeURIComponent(elementId)}?project_id=${encodeURIComponent(projectId)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: descDraft,
          }),
        }
      )
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Save failed: ${res.status} ${txt}`)
      }
      setStatus('Saved')
      setEditing(false)
    } catch (err) {
      console.error(err)
      setStatus('Error saving')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border rounded-lg bg-white shadow-card p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm uppercase font-semibold text-gray-500 tracking-wide">
            {type}
          </div>
          <div className="text-lg font-semibold text-gray-900 leading-tight">
            {label}
          </div>
          <div className="text-xs text-gray-500 break-all">
            {elementId}
          </div>
        </div>
        {!editing ? (
          <button
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded px-2 py-1"
            onClick={() => {
              setDescDraft(description ?? '')
              setEditing(true)
              setStatus(null)
            }}
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              disabled={saving}
              className="text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded px-2 py-1 disabled:opacity-40"
              onClick={() => {
                setEditing(false)
                setStatus(null)
                setDescDraft(description ?? '')
              }}
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded px-2 py-1 disabled:opacity-40"
              onClick={handleSave}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-700">
        {editing ? (
          <textarea
            className="w-full border rounded p-2 text-sm text-gray-800"
            rows={3}
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
          />
        ) : (
          <p>{description || <span className="text-gray-400 italic">No description yet</span>}</p>
        )}
      </div>

      {status && (
        <div
          className={
            'text-xs ' +
            (status === 'Saved'
              ? 'text-green-600'
              : status === 'Error saving'
              ? 'text-red-600'
              : 'text-gray-500')
          }
        >
          {status}
        </div>
      )}
    </div>
  )
}
