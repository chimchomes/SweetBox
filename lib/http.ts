// lib/http.ts
// Unified helpers for consistent API responses.

export function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Always return valid JSON on error so frontend .json() never explodes
export function errorResponse(message: string, status: number = 500) {
  return jsonResponse({ ok: false, error: message }, status);
}
