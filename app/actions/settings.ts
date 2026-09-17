"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

export async function updateSiteSettingsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const headline = formData.get("headline") as string;
  const subtext = formData.get("subtext") as string;
  const cta_primary_label = formData.get("cta_primary_label") as string;
  const cta_secondary_label = formData.get("cta_secondary_label") as string;
  const background_media_url = (formData.get("background_media_url") as string) || null;
  const background_media_type = ((formData.get("background_media_type") as string) || "image") as "image" | "video";

  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const whatsapp_number = formData.get("whatsapp_number") as string;
  const gst_number = formData.get("gst_number") as string;

  const instagram = formData.get("instagram") as string;
  const facebook = formData.get("facebook") as string;
  const youtube = formData.get("youtube") as string;

  const hero_content = {
    headline,
    subtext,
    cta_primary_label,
    cta_secondary_label,
    background_media_url,
    background_media_type,
  };
  const contact_info = { phone, email, address, whatsapp_number, gst_number };
  const social_links = { instagram, facebook, youtube };

  const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("site_settings")
      .update({
        hero_content,
        contact_info,
        social_links,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) console.error("updateSiteSettingsAction error:", error);
  } else {
    const { error } = await supabase.from("site_settings").insert([
      { hero_content, contact_info, social_links },
    ]);

    if (error) console.error("updateSiteSettingsAction error:", error);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
}
