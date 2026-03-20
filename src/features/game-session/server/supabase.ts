import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "./config";
import type { GamesDatabase } from "./types";

let supabaseAdminClient: SupabaseClient<GamesDatabase, "public"> | null = null;

export function getSupabaseAdminClient() {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const { url, serviceRoleKey } = getSupabaseServerConfig();

  supabaseAdminClient = createClient<GamesDatabase, "public">(
    url,
    serviceRoleKey,
    {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    }
  );

  return supabaseAdminClient;
}
