import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "./public";
import { createServerSupabaseClient } from "./server";
import type {
  Package,
  PackageCardData,
  PackageWithDays,
  GalleryItem,
  Testimonial,
  SiteSettings,
} from "./types";

// ─── Public Cached Packages ──────────────────────────────────────────────────

const getCachedAllPublishedPackages = unstable_cache(
  async () => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("packages")
      .select(
        "id, slug, name, summary, destinations, duration_nights, duration_days, pax_capacity, price_with_food, price_without_food, hero_image_url, vehicle_type, status"
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAllPublishedPackages] Database fetch error:", error.message);
      throw new Error(`[getAllPublishedPackages] ${error.message}`);
    }
    return (data as PackageCardData[]) ?? [];
  },
  ["all-published-packages"],
  { tags: ["packages"], revalidate: 3600 }
);

export async function getAllPublishedPackages(): Promise<PackageCardData[]> {
  try {
    return await getCachedAllPublishedPackages();
  } catch (err) {
    console.warn("[getAllPublishedPackages] Returning fallback due to fetch failure.");
    return [];
  }
}

const getCachedFeaturedPackages = unstable_cache(
  async (serializedIds?: string) => {
    const supabase = createPublicSupabaseClient();
    const ids: string[] | undefined = serializedIds ? JSON.parse(serializedIds) : undefined;

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
      console.error("[getFeaturedPackages] Database fetch error:", error.message);
      throw new Error(`[getFeaturedPackages] ${error.message}`);
    }
    return (data as PackageCardData[]) ?? [];
  },
  ["featured-packages"],
  { tags: ["packages"], revalidate: 3600 }
);

export async function getFeaturedPackages(ids?: string[]): Promise<PackageCardData[]> {
  try {
    const serialized = ids && ids.length > 0 ? JSON.stringify(ids) : undefined;
    return await getCachedFeaturedPackages(serialized);
  } catch (err) {
    console.warn("[getFeaturedPackages] Returning fallback due to fetch failure.");
    return [];
  }
}

const fetchRawPackageBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = createPublicSupabaseClient();
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
      console.error(`[getPackageBySlug] Database fetch error for slug '${slug}':`, error.message);
      throw new Error(`[getPackageBySlug] ${error.message}`);
    }
    if (!data) {
      throw new Error(`[getPackageBySlug] Package not found: ${slug}`);
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
  },
  ["package-by-slug"],
  { tags: ["packages"], revalidate: 3600 }
);

// React.cache dedupes duplicate calls between generateMetadata and Page component
export const getPackageBySlug = cache(async (slug: string): Promise<PackageWithDays | null> => {
  try {
    return await fetchRawPackageBySlug(slug);
  } catch (err) {
    console.warn(`[getPackageBySlug] Returning null fallback for slug '${slug}'.`);
    return null;
  }
});

const getCachedPackageSlugs = unstable_cache(
  async () => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("packages")
      .select("slug")
      .eq("status", "published");

    if (error) {
      console.error("[getAllPackageSlugs] Database fetch error:", error.message);
      throw new Error(`[getAllPackageSlugs] ${error.message}`);
    }
    return data?.map((p: { slug: string }) => p.slug) ?? [];
  },
  ["all-package-slugs"],
  { tags: ["packages"], revalidate: 3600 }
);

export async function getAllPackageSlugs(): Promise<string[]> {
  try {
    return await getCachedPackageSlugs();
  } catch (err) {
    console.warn("[getAllPackageSlugs] Returning fallback due to fetch failure.");
    return [];
  }
}

const getCachedSimilarPackages = unstable_cache(
  async (currentSlug: string, serializedDests: string) => {
    const supabase = createPublicSupabaseClient();
    const destinations: string[] = JSON.parse(serializedDests);

    const { data, error } = await supabase
      .from("packages")
      .select(
        "id, slug, name, summary, destinations, duration_nights, duration_days, pax_capacity, price_with_food, price_without_food, hero_image_url, vehicle_type, status"
      )
      .eq("status", "published")
      .neq("slug", currentSlug)
      .overlaps("destinations", destinations)
      .limit(4);

    if (error) {
      console.error("[getSimilarPackages] Database fetch error:", error.message);
      throw new Error(`[getSimilarPackages] ${error.message}`);
    }

    if (!data || data.length === 0) {
      const { data: fallback, error: fallbackError } = await supabase
        .from("packages")
        .select(
          "id, slug, name, summary, destinations, duration_nights, duration_days, pax_capacity, price_with_food, price_without_food, hero_image_url, vehicle_type, status"
        )
        .eq("status", "published")
        .neq("slug", currentSlug)
        .limit(4);

      if (fallbackError) {
        throw new Error(`[getSimilarPackages] Fallback error: ${fallbackError.message}`);
      }
      return (fallback as PackageCardData[]) ?? [];
    }

    return (data as PackageCardData[]) ?? [];
  },
  ["similar-packages"],
  { tags: ["packages"], revalidate: 3600 }
);

export async function getSimilarPackages(
  currentSlug: string,
  destinations: string[]
): Promise<PackageCardData[]> {
  try {
    return await getCachedSimilarPackages(currentSlug, JSON.stringify(destinations));
  } catch (err) {
    console.warn("[getSimilarPackages] Returning fallback due to fetch failure.");
    return [];
  }
}

// ─── Public Cached Gallery ────────────────────────────────────────────────────

const getCachedGalleryItems = unstable_cache(
  async (destinationTag?: string) => {
    const supabase = createPublicSupabaseClient();
    let query = supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (destinationTag) {
      query = query.eq("destination_tag", destinationTag);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[getAllGalleryItems] Database fetch error:", error.message);
      throw new Error(`[getAllGalleryItems] ${error.message}`);
    }
    return (data as GalleryItem[]) ?? [];
  },
  ["all-gallery-items"],
  { tags: ["gallery"], revalidate: 3600 }
);

export async function getAllGalleryItems(destinationTag?: string): Promise<GalleryItem[]> {
  try {
    return await getCachedGalleryItems(destinationTag);
  } catch (err) {
    console.warn("[getAllGalleryItems] Returning fallback due to fetch failure.");
    return [];
  }
}

const getCachedPackageGallery = unstable_cache(
  async (packageId: string) => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("package_id", packageId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(`[getPackageGallery] Database fetch error for packageId '${packageId}':`, error.message);
      throw new Error(`[getPackageGallery] ${error.message}`);
    }
    return (data as GalleryItem[]) ?? [];
  },
  ["package-gallery"],
  { tags: ["gallery"], revalidate: 3600 }
);

export async function getPackageGallery(packageId: string): Promise<GalleryItem[]> {
  try {
    return await getCachedPackageGallery(packageId);
  } catch (err) {
    console.warn(`[getPackageGallery] Returning fallback for packageId '${packageId}'.`);
    return [];
  }
}

// ─── Public Cached Testimonials ───────────────────────────────────────────────

const getCachedPublishedTestimonials = unstable_cache(
  async () => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*, package:packages(id, name, slug)")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[getPublishedTestimonials] Database fetch error:", error.message);
      throw new Error(`[getPublishedTestimonials] ${error.message}`);
    }
    return (data as unknown as Testimonial[]) ?? [];
  },
  ["published-testimonials"],
  { tags: ["testimonials"], revalidate: 3600 }
);

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    return await getCachedPublishedTestimonials();
  } catch (err) {
    console.warn("[getPublishedTestimonials] Returning fallback due to fetch failure.");
    return [];
  }
}

// ─── Public Cached Site Settings ──────────────────────────────────────────────

const getCachedSiteSettings = unstable_cache(
  async () => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[getSiteSettings] Database fetch error:", error.message);
      throw new Error(`[getSiteSettings] ${error.message}`);
    }
    if (!data) {
      throw new Error("[getSiteSettings] No site settings record found in database.");
    }
    return data as SiteSettings;
  },
  ["site-settings-cache"],
  { tags: ["site-settings"], revalidate: 3600 }
);

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await getCachedSiteSettings();
  } catch (err) {
    console.warn("[getSiteSettings] Returning fallback due to fetch failure.");
    return null;
  }
}

// ─── Dynamic Admin Queries (Session-Protected) ────────────────────────────────

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
