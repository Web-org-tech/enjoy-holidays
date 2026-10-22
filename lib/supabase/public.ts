import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Public, cookie-free, read-only Supabase client for Server Components and ISR.
 * Uses the anonymous key and does not read request cookies.
 * Enforces a strict 3-second fetch timeout to prevent database stalling.
 */
export function createPublicSupabaseClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co").trim().split(/\s+/)[0];
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key").trim().split(/\s+/)[0];

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort(new Error("Supabase public fetch timeout (3s)"));
        }, 3000);

        if (init?.signal) {
          init.signal.addEventListener("abort", () => controller.abort());
        }

        return fetch(input, {
          ...init,
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      },
    },
  });
}
