'use client'

import { useEffect, useMemo, useState } from 'react'

type VersionRow = {
  id: number
  project_id: string
  tag: string | null
  note: string | null
  created_at: string
}

export default function VersionsPage() {
  const [versions, setVersions] = useState<VersionRow[]>([])
  const [selectedA, setSelectedA] = useState<number | null>(null)
  const [selectedB, setSelectedB] = useState<number | null>(null)
  const [specA, setSpecA] = useState<any | null>(null)
  const [specB, setSpecB] = useState<any | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function loadList() {
    const res = await fetch('/api/versions?project_id=sweetbox_001')
    const json = await res.json()
    setVersions(json.versions || [])
  }

  async function loadVersion(id: number, setter: (v:any)=>void) {
    const res = await fetch(`/api/versions/${id}`)
    const json = await res.json()
    setter(json.version || null)
  }

  useEffect(() => {
    loadList()
  }, [])

  useEffect(() => {
    if (selectedA) loadVersion(selectedA, (v)=>setSpecA(v))
    else setSpecA(null)
  }, [selectedA])

  useEffect(() => {
    if (selectedB) loadVersion(selectedB, (v)=>setSpecB(v))
    else setSpecB(null)
  }, [selectedB])

  function stableJSONString(obj:any) {
    const seen = new WeakSet()
    const replacer = (_key:any, value:any) => {
      if (value && typeof value === 'object') {
        if (seen.has(value)) return
        seen.add(value)
        if (!Array.isArray(value)) {
          return Object.keys(value).sort().reduce((acc:any, k) => {
            acc[k] = value[k]
            return acc
          }, {})
        }
      }
      return value
    }
    return JSON.stringify(obj, replacer, 2)
  }

  const diffText = useMemo(() => {
    if (!specA || !specB) return ''
    const a = stableJSONString(specA.developer_spec)
    const b = stableJSONString(specB.developer_spec)
    const aLines = a.split('\n')
    const bLines = b.split('\n')
    const out:string[] = []
    const max = Math.max(aLines.length, bLines.length)
    for (let i=0; i<max; i++) {
      const la = aLines[i] ?? ''
      const lb = bLines[i] ?? ''
      if (la === lb) out.push('  ' + la)
      else {
        if (la) out.push('- ' + la)
        if (lb) out.push('+ ' + lb)
      }
    }
    return out.join('\n')
  }, [specA, specB])

  async function createSnapshot() {
    setInfo('Creating snapshot...')
    const res = await fetch('/api/versions', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ project_id: 'sweetbox_001', tag: 'auto', note: 'Created from UI' })
    })
    if (!res.ok) {
      setInfo('Failed to create snapshot')
      return
    }
    await loadList()
    setInfo('Snapshot created')
  }

  return (
    <main className="p-6 bg-gray-100 min-h-screen text-gray-900 space-y-6">
      <h1 className="text-2xl font-semibold">SweetBox Versions</h1>

      <div className="flex items-center gap-3">
        <button
          className="px-3 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={createSnapshot}
        >
          Create Snapshot (current state)
        </button>
        {info && <span className="text-sm text-gray-600">{info}</span>}
      </div>

      <section className="bg-white shadow-card rounded-xl p-4">
        <h2 className="font-semibold mb-3">Version List (sweetbox_001)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">ID</th>
              <th className="py-2">Tag</th>
              <th className="py-2">Note</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {versions.map(v => (
              <tr key={v.id} className="border-t">
                <td className="py-2">{v.id}</td>
                <td className="py-2">{v.tag || '-'}</td>
                <td className="py-2">{v.note || '-'}</td>
                <td className="py-2">{new Date(v.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white shadow-card rounded-xl p-4 space-y-3">
        <h2 className="font-semibold">Compare Developer Spec</h2>
        <div className="flex gap-3">
          <select
            className="border rounded px-2 py-1"
            value={selectedA ?? ''}
            onChange={e => setSelectedA(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select A</option>
            {versions.map(v => (
              <option key={v.id} value={v.id}>
                {v.id} — {v.tag || ''} — {new Date(v.created_at).toLocaleString()}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={selectedB ?? ''}
            onChange={e => setSelectedB(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select B</option>
            {versions.map(v => (
              <option key={v.id} value={v.id}>
                {v.id} — {v.tag || ''} — {new Date(v.created_at).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {!!diffText && (
          <pre className="text-xs bg-gray-50 border rounded p-3 overflow-auto max-h-[480px] whitespace-pre-wrap">
{diffText}
          </pre>
        )}
      </section>
    </main>
  )
} 