/**
 * Canonical Site URL and URL helpers
 * Single source of truth for https://www.padmacabs.in
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.padmacabs.in";

// Ensure no trailing slash
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export const CANONICAL_HOST = "www.padmacabs.in";

/**
 * Returns an absolute URL guaranteed to start with SITE_URL and have a clean single slash.
 */
export function absoluteUrl(path: string = ""): string {
  if (!path || path === "/" || path === ".") {
    return SITE_URL;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
