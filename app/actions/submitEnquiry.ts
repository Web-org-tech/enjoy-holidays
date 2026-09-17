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
  honeypot?: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitEnquiry(data: EnquiryFormData): Promise<ActionResult> {
  // Honeypot spam trap: bots fill hidden fields, humans do not
  if (data.honeypot && data.honeypot.trim().length > 0) {
    // Silently return success to stop bot retry without inserting spam record
    return { success: true };
  }

  // Name validation
  const trimmedName = data.name?.trim() || "";
  if (trimmedName.length < 2) {
    return { success: false, error: "Please enter your full name (at least 2 characters)." };
  }
  if (trimmedName.length > 100) {
    return { success: false, error: "Name is too long (maximum 100 characters)." };
  }

  // Phone validation (Indian 10-digit or international 7-15 digit)
  const rawPhone = (data.phone || "").replace(/[\s\-\(\)]/g, "");
  const cleanPhone = rawPhone.replace(/^(\+91|91)/, "");
  const indianRegex = /^[6-9]\d{9}$/;
  const internationalRegex = /^\+?[1-9]\d{6,14}$/;

  let validatedPhone = "";
  if (indianRegex.test(cleanPhone)) {
    validatedPhone = cleanPhone;
  } else if (internationalRegex.test(rawPhone)) {
    validatedPhone = rawPhone;
  } else {
    return {
      success: false,
      error: "Please enter a valid mobile number (10-digit mobile or international format with country code).",
    };
  }

  // Email validation (optional but must be valid if provided)
  const trimmedEmail = data.email?.trim() || "";
  if (trimmedEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
      return { success: false, error: "Please enter a valid email address." };
    }
  }

  // Sanitize message
  const sanitizedMessage = data.message?.trim() ? data.message.trim().slice(0, 2000) : null;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("enquiries").insert({
      name: trimmedName,
      phone: validatedPhone,
      email: trimmedEmail || null,
      package_id: data.package_id || null,
      message: sanitizedMessage,
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
