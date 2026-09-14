import { createClient } from "@supabase/supabase-js";

// Service-role client — only for admin Server Actions, never exposed to browser
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-service-key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
