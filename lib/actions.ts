// lib/actions.ts
export type ButtonAction = {
  action_type: "navigate" | "save_progress" | "submit_form" | "custom";
  details: string;
  target?: string;
};

export function describeActions(actions: ButtonAction[]): string[] {
  if (!actions || actions.length === 0) return ["    (no actions defined)"];
  return actions.map((a) => {
    const base = `    - ${a.action_type}`;
    const withTarget = a.target ? `${base} → ${a.target}` : base;
    const withDetails = a.details ? `${withTarget} :: ${a.details}` : withTarget;
    return withDetails;
  });
}
