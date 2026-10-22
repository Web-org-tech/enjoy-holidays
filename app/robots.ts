import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
          "/auth/",
          "/auth/*",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
