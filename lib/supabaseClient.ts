"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseClientResult = {
  client: SupabaseClient | null;
  error: string | null;
};

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClientResult {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return {
      client: null,
      error:
        "Missing env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  if (!cachedClient) {
    cachedClient = createBrowserClient(supabaseUrl, supabasePublishableKey);
  }

  return { client: cachedClient, error: null };
}
