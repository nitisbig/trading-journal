import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "./config.js";
import type { Database } from "./types.js";

export interface Session {
  client: SupabaseClient<Database>;
  userId: string;
}

let session: Session | null = null;
let pending: Promise<Session> | null = null;

/**
 * Signs in once with the configured email/password and caches the authenticated
 * client. Every query runs as this user, so Supabase RLS is the isolation
 * boundary — no service-role key is used. The token auto-refreshes in memory.
 */
export async function getSession(): Promise<Session> {
  if (session) return session;
  if (pending) return pending;

  pending = (async () => {
    const client = createClient<Database>(
      config.supabaseUrl,
      config.supabaseAnonKey,
      { auth: { persistSession: false, autoRefreshToken: true } },
    );

    const { data, error } = await client.auth.signInWithPassword({
      email: config.email,
      password: config.password,
    });

    if (error || !data.user) {
      throw new Error(
        `Supabase sign-in failed: ${error?.message ?? "no user returned"}`,
      );
    }

    session = { client, userId: data.user.id };
    return session;
  })();

  try {
    return await pending;
  } finally {
    pending = null;
  }
}
