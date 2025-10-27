// lib/db.ts
// Supabase client for server-side API routes

import { createClient } from '@supabase/supabase-js'

// We rely on NEXT_PUBLIC_* here so it's available both server and client.
// In prod you'd separate service role vs anon, but anon is fine for local/internal builder usage.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)
