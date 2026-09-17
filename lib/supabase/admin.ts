import { createClient } from "@supabase/supabase-js";

// Service-role client — only for admin Server Actions, never exposed to browser
export function createAdminSupabaseClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co").trim().split(/\s+/)[0];
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-service-key").trim().split(/\s+/)[0];

  return createClient(
    url,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
