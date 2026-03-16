import "server-only";

export class SupabaseConfigurationError extends Error {
  constructor() {
    super("Supabase is not configured.");
    this.name = "SupabaseConfigurationError";
  }
}

export function getSupabaseServerConfig() {
  const url = process.env.SUPABASE_URL?.trim() || null;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;

  if (!url || !serviceRoleKey) {
    throw new SupabaseConfigurationError();
  }

  return {
    url,
    serviceRoleKey,
  };
}
