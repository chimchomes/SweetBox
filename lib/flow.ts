// lib/flow.ts
export function getFlow(devSpec:any) {
  if (!devSpec) return { nodes: [], links: [] }
  const nodes = []
  const links = []

  devSpec.pages?.forEach((p:any) => nodes.push({ id:p.id, type:'page', label:p.label }))
  devSpec.forms?.forEach((f:any) => nodes.push({ id:f.id, type:'form', label:f.label }))
  devSpec.buttons?.forEach((b:any) => nodes.push({ id:b.id, type:'button', label:b.label }))

  // simple example linking buttons to pages/forms
  devSpec.buttons?.forEach((b:any) => {
    links.push({ from:b.id, to:'page_dashboard' })
  })

  return { nodes, links }
}