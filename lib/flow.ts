// lib/flow.ts
export function getFlow(devSpec: any) {
  if (!devSpec) return { nodes: [] as any[], links: [] as any[] };

  const nodes: any[] = [];
  const links: any[] = [];

  devSpec.pages?.forEach((p: any) =>
    nodes.push({ id: p.id, type: "page", label: p.label })
  );
  devSpec.forms?.forEach((f: any) =>
    nodes.push({ id: f.id, type: "form", label: f.label })
  );
  devSpec.buttons?.forEach((b: any) =>
    nodes.push({ id: b.id, type: "button", label: b.label })
  );

  devSpec.buttons?.forEach((b: any) => {
    if (b.actions && Array.isArray(b.actions)) {
      b.actions.forEach((a: any) => {
        if (a && a.action_type === "navigate" && a.target) {
          links.push({ source: b.id, target: a.target });
        }
      });
    }
  });

  return { nodes, links };
}