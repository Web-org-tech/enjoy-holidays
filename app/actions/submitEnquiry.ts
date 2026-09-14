"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface EnquiryFormData {
  name: string;
  phone: string;
  email?: string;
  package_id?: string;
  message?: string;
  source?: "form" | "whatsapp_click" | "phone";
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitEnquiry(data: EnquiryFormData): Promise<ActionResult> {
  // Basic validation
  if (!data.name?.trim() || data.name.trim().length < 2) {
    return { success: false, error: "Please enter your full name." };
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = data.phone?.replace(/\s+/g, "").replace(/^(\+91|91)/, "");
  if (!phoneRegex.test(cleanPhone)) {
    return { success: false, error: "Please enter a valid 10-digit Indian mobile number." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("enquiries").insert({
      name: data.name.trim(),
      phone: cleanPhone,
      email: data.email?.trim() || null,
      package_id: data.package_id || null,
      message: data.message?.trim() || null,
      source: data.source ?? "form",
      status: "new",
    });

    if (error) {
      console.error("[submitEnquiry]", error.message);
      return { success: false, error: "Something went wrong. Please try WhatsApp instead." };
    }

    return { success: true };
  } catch (err) {
    console.error("[submitEnquiry] exception:", err);
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function logWhatsAppClick(packageId?: string): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from("enquiries").insert({
      name: "WhatsApp Click",
      phone: "0000000000",
      package_id: packageId || null,
      source: "whatsapp_click",
      status: "new",
    });
  } catch {
    // Non-critical — don't surface errors for analytics
  }
}
