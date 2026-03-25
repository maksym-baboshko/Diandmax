"use client";

import { type SupabaseClient, createClient } from "@supabase/supabase-js";

export class SupabaseBrowserConfigurationError extends Error {
  constructor() {
    super("Supabase browser auth is not configured.");
    this.name = "SupabaseBrowserConfigurationError";
  }
}

let browserClient: SupabaseClient | null = null;

function getSupabaseBrowserConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim() || null;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    null;

  if (!url || !publishableKey) {
    throw new SupabaseBrowserConfigurationError();
  }

  return { url, publishableKey };
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const { url, publishableKey } = getSupabaseBrowserConfig();

  browserClient = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });

  return browserClient;
}
