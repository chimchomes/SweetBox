// lib/actions.ts
export type SBAction = { action_type?: string; target?: string; details?: string };
export function describeActions(actions: SBAction[]): string[] {
  if (!Array.isArray(actions)) return [];
  const out: string[] = [];
  for (const a of actions) {
    const type = a.action_type || 'unknown';
    const tgt = a.target ? ` -> ${a.target}` : '';
    const det = a.details ? ` (${a.details})` : '';
    out.push(`    * ${type}${tgt}${det}`);
  }
  return out;
}
