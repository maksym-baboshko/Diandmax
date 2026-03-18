"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseBrowserConfigurationError extends Error {
  constructor() {
    super("Supabase browser auth is not configured.");
    this.name = "SupabaseBrowserConfigurationError";
  }
}

let browserClient: SupabaseClient | null = null;

function getSupabaseBrowserConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    null;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    null;

  if (!url || !publishableKey) {
    throw new SupabaseBrowserConfigurationError();
  }

  return {
    url,
    publishableKey,
  };
}

export function getSupabaseBrowserClient() {
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

async function signInAnonymously(supabase: SupabaseClient) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error("Anonymous auth session is missing.");
  }

  return session.access_token;
}

export async function getGameAuthAccessToken() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (session?.access_token) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(session.access_token);

    if (!userError && user) {
      return session.access_token;
    }

    const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
    if (signOutError) {
      console.warn("Failed to clear stale Supabase session:", signOutError);
    }
  }

  return signInAnonymously(supabase);
}

export async function signOutGameAuth() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
