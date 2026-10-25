"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const customer_name = formData.get("customer_name") as string;
  const quote = formData.get("quote") as string;
  const rating = parseInt(formData.get("rating") as string || "5", 10);
  const photo_url = (formData.get("photo_url") as string) || null;
  const is_published = formData.get("is_published") === "on" || formData.get("is_published") === "true";

  if (!customer_name || !quote) return;

  const { error } = await supabase.from("testimonials").insert([
    {
      customer_name,
      quote,
      rating,
      photo_url,
      is_published,
    },
  ]);

  if (error) {
    console.error("createTestimonialAction error:", error);
    return;
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialPublishAction(id: string, currentPublished: boolean): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("testimonials")
    .update({ is_published: !currentPublished })
    .eq("id", id);

  if (error) {
    console.error("toggleTestimonialPublishAction error:", error);
    return;
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    console.error("deleteTestimonialAction error:", error);
    return;
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

