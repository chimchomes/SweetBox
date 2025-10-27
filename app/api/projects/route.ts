// app/api/projects/route.ts
import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/http';
import { listProjects } from '@/lib/memoryStore';

export async function GET(req: NextRequest) {
  const projects = listProjects();
  return jsonResponse({ projects });
}
