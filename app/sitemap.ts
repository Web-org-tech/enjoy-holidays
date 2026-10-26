import { getAllPackageSlugs } from "@/lib/supabase/queries";
import type { MetadataRoute } from "next";

function getCanonicalBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (
    envUrl &&
    !envUrl.includes("localhost") &&
    !envUrl.includes("127.0.0.1") &&
    !envUrl.includes(".vercel.app")
  ) {
    return envUrl.replace(/\/+$/, "");
  }
  return "https://www.padmacabs.in";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalBaseUrl();
  const buildUrl = (path: string = "") => {
    if (!path || path === "/") return baseUrl;
    const clean = path.replace(/^\/+/, "");
    return `${baseUrl}/${clean}`;
  };

  let slugs: string[] = [];
  try {
    slugs = await getAllPackageSlugs();
  } catch (error) {
    console.error("[sitemap] Failed to fetch package slugs:", error);
  }

  const now = new Date();

  const packageUrls = slugs.map((slug) => ({
    url: buildUrl(`/packages/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    { url: buildUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: buildUrl("/packages"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: buildUrl("/feedback"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: buildUrl("/gallery"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: buildUrl("/testimonials"), lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: buildUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: buildUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: buildUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: buildUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...packageUrls,
  ];
}
