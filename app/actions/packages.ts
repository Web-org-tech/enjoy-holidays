"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ItineraryActivityInput {
  icon: string;
  label: string;
}

interface ItineraryDayInput {
  day_number: number;
  title: string;
  subtitle?: string | null;
  photo_url?: string | null;
  transition_text?: string | null;
  activities?: ItineraryActivityInput[];
}

export async function createPackageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const summary = (formData.get("summary") as string) || "";
  const duration_days = parseInt(formData.get("duration_days") as string || "1", 10);
  const duration_nights = parseInt(formData.get("duration_nights") as string || "0", 10);
  const pax_capacity = parseInt(formData.get("pax_capacity") as string || "10", 10);
  const price_with_food = parseFloat(formData.get("price_with_food") as string || "0");
  const price_without_food = formData.get("price_without_food") ? parseFloat(formData.get("price_without_food") as string) : null;
  const hero_image_url = formData.get("hero_image_url") as string || null;
  const vehicle_type = formData.get("vehicle_type") as string || "jeep";
  const status = formData.get("status") as string || "draft";
  const destinations = (formData.get("destinations") as string || "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  const { data: pkg, error } = await supabase
    .from("packages")
    .insert([
      {
        name,
        slug,
        summary,
        duration_days,
        duration_nights,
        pax_capacity,
        price_with_food,
        price_without_food,
        hero_image_url,
        vehicle_type,
        status,
        destinations,
      },
    ])
    .select()
    .single();

  if (error || !pkg) {
    console.error("createPackageAction error:", error);
    return;
  }

  // Handle inclusions
  const inclusions = (formData.get("inclusions") as string || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (inclusions.length > 0) {
    await supabase.from("package_inclusions").insert(
      inclusions.map((text, idx) => ({ package_id: pkg.id, text, sort_order: idx }))
    );
  }

  // Handle exclusions
  const exclusions = (formData.get("exclusions") as string || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (exclusions.length > 0) {
    await supabase.from("package_exclusions").insert(
      exclusions.map((text, idx) => ({ package_id: pkg.id, text, sort_order: idx }))
    );
  }

  // Handle nested Itinerary (Days & Activities)
  const itineraryRaw = formData.get("itinerary_json") as string;
  if (itineraryRaw) {
    try {
      const days: ItineraryDayInput[] = JSON.parse(itineraryRaw);
      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const { data: dayRecord, error: dayError } = await supabase
          .from("package_days")
          .insert({
            package_id: pkg.id,
            day_number: day.day_number ?? i,
            title: day.title || `Day ${i}`,
            subtitle: day.subtitle || null,
            photo_url: day.photo_url || null,
            transition_text: day.transition_text || null,
            sort_order: i,
          })
          .select("id")
          .single();

        if (dayRecord && day.activities && day.activities.length > 0) {
          const actRows = day.activities
            .filter((a) => a.label?.trim())
            .map((a, actIdx) => ({
              package_day_id: dayRecord.id,
              icon: a.icon || "activity",
              label: a.label.trim(),
              sort_order: actIdx,
            }));

          if (actRows.length > 0) {
            await supabase.from("day_activities").insert(actRows);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse/save itinerary:", e);
    }
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/");

  redirect("/admin/packages");
}

export async function updatePackageAction(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const summary = (formData.get("summary") as string) || "";
  const duration_days = parseInt(formData.get("duration_days") as string || "1", 10);
  const duration_nights = parseInt(formData.get("duration_nights") as string || "0", 10);
  const pax_capacity = parseInt(formData.get("pax_capacity") as string || "10", 10);
  const price_with_food = parseFloat(formData.get("price_with_food") as string || "0");
  const price_without_food = formData.get("price_without_food") ? parseFloat(formData.get("price_without_food") as string) : null;
  const hero_image_url = formData.get("hero_image_url") as string || null;
  const vehicle_type = formData.get("vehicle_type") as string || "jeep";
  const status = formData.get("status") as string || "draft";
  const destinations = (formData.get("destinations") as string || "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("packages")
    .update({
      name,
      slug,
      summary,
      duration_days,
      duration_nights,
      pax_capacity,
      price_with_food,
      price_without_food,
      hero_image_url,
      vehicle_type,
      status,
      destinations,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("updatePackageAction error:", error);
    return;
  }

  // Update Inclusions
  const inclusions = (formData.get("inclusions") as string || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await supabase.from("package_inclusions").delete().eq("package_id", id);
  if (inclusions.length > 0) {
    await supabase.from("package_inclusions").insert(
      inclusions.map((text, idx) => ({ package_id: id, text, sort_order: idx }))
    );
  }

  // Update Exclusions
  const exclusions = (formData.get("exclusions") as string || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await supabase.from("package_exclusions").delete().eq("package_id", id);
  if (exclusions.length > 0) {
    await supabase.from("package_exclusions").insert(
      exclusions.map((text, idx) => ({ package_id: id, text, sort_order: idx }))
    );
  }

  // Update Itinerary (package_days + day_activities)
  const itineraryRaw = formData.get("itinerary_json") as string;
  if (itineraryRaw) {
    try {
      const days: ItineraryDayInput[] = JSON.parse(itineraryRaw);
      // Delete existing package_days (which cascade deletes day_activities)
      await supabase.from("package_days").delete().eq("package_id", id);

      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const { data: dayRecord, error: dayError } = await supabase
          .from("package_days")
          .insert({
            package_id: id,
            day_number: day.day_number ?? i,
            title: day.title || `Day ${i}`,
            subtitle: day.subtitle || null,
            photo_url: day.photo_url || null,
            transition_text: day.transition_text || null,
            sort_order: i,
          })
          .select("id")
          .single();

        if (dayRecord && day.activities && day.activities.length > 0) {
          const actRows = day.activities
            .filter((a) => a.label?.trim())
            .map((a, actIdx) => ({
              package_day_id: dayRecord.id,
              icon: a.icon || "activity",
              label: a.label.trim(),
              sort_order: actIdx,
            }));

          if (actRows.length > 0) {
            await supabase.from("day_activities").insert(actRows);
          }
        }
      }
    } catch (e) {
      console.error("Failed to update itinerary:", e);
    }
  }

  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${id}`);
  revalidatePath("/packages");
  revalidatePath(`/packages/${slug}`);
  revalidatePath("/");

  redirect("/admin/packages");
}

export async function deletePackageAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("packages").delete().eq("id", id);

  if (error) {
    console.error("deletePackageAction error:", error);
    return;
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/");
}

export async function togglePackageStatusAction(id: string, currentStatus: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const nextStatus = currentStatus === "published" ? "draft" : "published";

  const { error } = await supabase
    .from("packages")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("togglePackageStatusAction error:", error);
    return;
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/");
}
