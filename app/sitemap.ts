import { SITE_URL, absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data, error } = await supabase
        .from("packages")
        .select("slug, updated_at")
        .eq("status", "published");

      if (!error && Array.isArray(data)) {
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
      }
    }
  } catch (err) {
    console.error("[sitemap] Failed to fetch packages for sitemap:", err);
  }

  return [...staticRoutes, ...packageUrls];
}
