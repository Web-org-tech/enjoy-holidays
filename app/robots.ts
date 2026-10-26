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

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/admin/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
