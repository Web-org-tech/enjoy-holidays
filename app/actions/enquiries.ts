"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

export async function updateEnquiryStatusAction(id: string, status: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("updateEnquiryStatusAction error:", error);
    return;
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteEnquiryAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);

  if (error) {
    console.error("deleteEnquiryAction error:", error);
    return;
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

