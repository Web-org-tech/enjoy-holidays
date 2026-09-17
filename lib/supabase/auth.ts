import { createServerSupabaseClient } from "./server";

/**
 * Server-side authentication guard for Server Actions and protected operations.
 * Throws an error if no authenticated session exists.
 * Returns the authenticated user object.
 */
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: Admin authentication required.");
  }

  return user;
}
