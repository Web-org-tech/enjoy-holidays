"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface SubmitReviewResult {
  success: boolean;
  message: string;
}

export async function submitReviewAction(formData: FormData): Promise<SubmitReviewResult> {
  try {
    // 1. Honeypot check
    const honeypot = formData.get("company_website") as string;
    if (honeypot && honeypot.trim().length > 0) {
      // Return a simulated success to confuse bot crawlers
      return {
        success: true,
        message: "Thank you for your feedback!",
      };
    }

    const customer_name = (formData.get("customer_name") as string || "").trim();
    const quote = (formData.get("quote") as string || "").trim();
    const ratingRaw = formData.get("rating") as string;
    const rating = Math.min(5, Math.max(1, parseInt(ratingRaw || "5", 10)));
    const photo_url = (formData.get("photo_url") as string || "").trim() || null;

    if (!customer_name || customer_name.length < 2 || customer_name.length > 80) {
      return {
        success: false,
        message: "Please provide a valid name (2 to 80 characters).",
      };
    }

    if (!quote || quote.length < 10 || quote.length > 1500) {
      return {
        success: false,
        message: "Please write a review between 10 and 1500 characters.",
      };
    }

    const supabase = createAdminSupabaseClient();

    const { error } = await supabase.from("testimonials").insert([
      {
        customer_name,
        quote,
        rating,
        photo_url,
        is_published: false, // Strictly false until approved by Admin in /admin/testimonials
      },
    ]);

    if (error) {
      console.error("submitReviewAction Supabase error:", error);
      return {
        success: false,
        message: "We encountered an issue saving your review. Please try again shortly.",
      };
    }

    return {
      success: true,
      message: "Thank you! Your review has been submitted successfully. It will be published once reviewed by our team.",
    };
  } catch (err: unknown) {
    console.error("submitReviewAction uncaught error:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
