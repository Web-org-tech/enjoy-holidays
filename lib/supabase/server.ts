import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co").trim().split(/\s+/)[0];
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key").trim().split(/\s+/)[0];

  try {
    const cookieStore = await cookies();
    return createServerClient(
      url,
      anonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server Component — safe to ignore during render
            }
          },
        },
      }
    );
  } catch {
    // Fallback for static generation (SSG / generateStaticParams) where request cookies are not available
    return createClient(
      url,
      anonKey
    );
  }
}
