import { createServerSupabaseClient } from "./server";
import type {
  Package,
  PackageCardData,
  PackageWithDays,
  GalleryItem,
  Testimonial,
  SiteSettings,
} from "./types";

// ─── Packages ────────────────────────────────────────────────────────────────

export async function getAllPublishedPackages(): Promise<PackageCardData[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      "id, slug, name, summary, destinations, duration_nights, duration_days, pax_capacity, price_with_food, price_without_food, hero_image_url, vehicle_type, status"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllPublishedPackages]", error.message);
    return [];
  }
  return (data as PackageCardData[]) ?? [];
}

export async function getFeaturedPackages(ids?: string[]): Promise<PackageCardData[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("packages")
    .select(
      "id, slug, name, summary, destinations, duration_nights, duration_days, pax_capacity, price_with_food, price_without_food, hero_image_url, vehicle_type, status"
    )
    .eq("status", "published");

  if (ids && ids.length > 0) {
    query = query.in("id", ids);
  } else {
    query = query.limit(6);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[getFeaturedPackages]", error.message);
    return [];
  }
  return (data as PackageCardData[]) ?? [];
}

export async function getPackageBySlug(slug: string): Promise<PackageWithDays | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      `
      *,
      package_days (
        *,
        day_activities ( * )
      ),
      package_inclusions ( * ),
      package_exclusions ( * ),
      gallery_items ( * )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("[getPackageBySlug]", error.message);
    return null;
  }

  // Sort nested arrays
  if (data?.package_days) {
    data.package_days.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);
    data.package_days.forEach((day: { day_activities?: { sort_order: number }[] }) => {
      if (day.day_activities) {
        day.day_activities.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);
      }
    });
  }

  return data as unknown as PackageWithDays;
}

export async function getAllPackageSlugs(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("packages")
    .select("slug")
    .eq("status", "published");
  return data?.map((p: { slug: string }) => p.slug) ?? [];
}

export async function getSimilarPackages(
  currentSlug: string,
  destinations: string[]
): Promise<PackageCardData[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("packages")
    .select(
      "id, slug, name, summary, destinations, duration_nights, duration_days, pax_capacity, price_with_food, price_without_food, hero_image_url, vehicle_type, status"
    )
    .eq("status", "published")
    .neq("slug", currentSlug)
    .overlaps("destinations", destinations)
    .limit(4);

  if (!data || data.length === 0) {
    // Fallback: return any 4 published packages
    const { data: fallback } = await supabase
      .from("packages")
      .select(
        "id, slug, name, summary, destinations, duration_nights, duration_days, pax_capacity, price_with_food, price_without_food, hero_image_url, vehicle_type, status"
      )
      .eq("status", "published")
      .neq("slug", currentSlug)
      .limit(4);
    return (fallback as PackageCardData[]) ?? [];
  }

  return (data as PackageCardData[]) ?? [];
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function getAllGalleryItems(destinationTag?: string): Promise<GalleryItem[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (destinationTag) {
    query = query.eq("destination_tag", destinationTag);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[getAllGalleryItems]", error.message);
    return [];
  }
  return (data as GalleryItem[]) ?? [];
}

export async function getPackageGallery(packageId: string): Promise<GalleryItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("package_id", packageId)
    .order("sort_order", { ascending: true });
  return (data as GalleryItem[]) ?? [];
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*, package:packages(id, name, slug)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPublishedTestimonials]", error.message);
    return [];
  }
  return (data as unknown as Testimonial[]) ?? [];
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error) {
    console.error("[getSiteSettings]", error.message);
    return null;
  }
  return data as SiteSettings;
}

// ─── Admin queries (use createAdminSupabaseClient in actions) ─────────────────

export async function getAllPackagesAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("packages")
    .select("id, slug, name, status, duration_days, price_with_food, destinations, created_at, updated_at")
    .order("created_at", { ascending: false });
  return (data as Partial<Package>[]) ?? [];
}

export async function getPackageForEdit(id: string): Promise<PackageWithDays | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("packages")
    .select(`
      *,
      package_days ( *, day_activities ( * ) ),
      package_inclusions ( * ),
      package_exclusions ( * )
    `)
    .eq("id", id)
    .single();

  if (!data) return null;

  if (data?.package_days) {
    data.package_days.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);
  }

  return data as unknown as PackageWithDays;
}

export async function getAllEnquiriesAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*, package:packages(id, name, slug)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*, package:packages(id, name, slug)")
    .order("sort_order", { ascending: true });
  return (data as unknown as Testimonial[]) ?? [];
}
