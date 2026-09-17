"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

export async function createGalleryItemAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const media_url = formData.get("media_url") as string;
  const destination_tag = (formData.get("destination_tag") as string) || null;
  const alt_text = (formData.get("alt_text") as string) || null;
  const media_type = (formData.get("media_type") as string) || "image";

  if (!media_url) return;

  const { error } = await supabase.from("gallery_items").insert([
    {
      media_url,
      destination_tag,
      alt_text,
      media_type,
    },
  ]);

  if (error) {
    console.error("createGalleryItemAction error:", error);
    return;
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItemAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);

  if (error) {
    console.error("deleteGalleryItemAction error:", error);
    return;
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

