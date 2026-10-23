import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export const revalidate = 86400; // Daily ISR revalidation

// Verified published package slugs as a resilience fallback to ensure
// transient database interruptions NEVER produce a truncated 9-URL sitemap.
const VERIFIED_PUBLISHED_SLUGS = [
  "madurai-heritage-temple-tour",
  "coorg-highlands-retreat",
  "3day-kerala",
  "kerala-coastal-escape",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1.0 },
    { url: absoluteUrl("/packages"), changeFrequency: "daily", priority: 0.95 },
    { url: absoluteUrl("/feedback"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/gallery"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/testimonials"), changeFrequency: "weekly", priority: 0.75 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/privacy-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  ];

  let packageUrls: MetadataRoute.Sitemap = [];

  try {
    const { createPublicSupabaseClient } = await import("@/lib/supabase/public");
    const supabase = createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("packages")
      .select("slug, updated_at")
      .eq("status", "published");

    if (!error && Array.isArray(data) && data.length > 0) {
      packageUrls = data.map((pkg) => {
        const entry: MetadataRoute.Sitemap[number] = {
          url: absoluteUrl(`/packages/${pkg.slug}`),
          changeFrequency: "weekly" as const,
          priority: 0.9,
        };
        if (pkg.updated_at) {
          entry.lastModified = new Date(pkg.updated_at);
        }
        return entry;
      });
    } else if (error) {
      console.warn("[sitemap] Database fetch error, using verified fallback:", error.message);
    }
  } catch (err) {
    console.warn("[sitemap] Failed to query packages for sitemap, using verified fallback:", err);
  }

  // Safety guard: if database was unreachable or returned empty,
  // use the verified published packages so Google Search Console never receives an incomplete sitemap.
  if (packageUrls.length === 0) {
    packageUrls = VERIFIED_PUBLISHED_SLUGS.map((slug) => ({
      url: absoluteUrl(`/packages/${slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  }

  return [...staticRoutes, ...packageUrls];
}
