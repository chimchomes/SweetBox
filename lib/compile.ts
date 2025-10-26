// lib/compile.ts
export function buildCompileBundle(params: any) {
  const { project, pages, forms, buttons } = params;
  const ai_builder_prompt = "AI Builder prompt compiled successfully.";
  const developer_spec = { project, pages, forms, buttons };
  const machine_registry = { pages, forms, buttons };
  return { ai_builder_prompt, developer_spec, machine_registry };
}
