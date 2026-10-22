/**
 * Canonical Site URL and URL helpers
 * Single source of truth for https://www.padmacabs.in
 */

export const CANONICAL_SITE_URL = "https://www.padmacabs.in";
export const CANONICAL_HOST = "www.padmacabs.in";

/**
 * Validates and resolves the public canonical site URL.
 * Strictly rejects localhost, loopback addresses, and *.vercel.app preview URLs
 * to prevent staging or local builds from corrupting sitemaps and canonical tags.
 */
export function resolveCanonicalSiteUrl(envUrl?: string): string {
  const candidate = (envUrl || "").trim();
  if (!candidate) {
    return CANONICAL_SITE_URL;
  }

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.toLowerCase();

    // Reject loopbacks and dev hosts
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host === "[::1]"
    ) {
      return CANONICAL_SITE_URL;
    }

    // Reject Vercel preview and deployment domains
    if (host.endsWith(".vercel.app")) {
      return CANONICAL_SITE_URL;
    }

    // Normalize apex domain to canonical www
    if (host === "padmacabs.in") {
      return CANONICAL_SITE_URL;
    }

    // If matching canonical host, enforce https and strip trailing slash
    if (host === CANONICAL_HOST) {
      return CANONICAL_SITE_URL;
    }

    // For any other custom domain (if configured), enforce https and remove trailing slashes
    return `https://${host}`;
  } catch {
    return CANONICAL_SITE_URL;
  }
}

export const SITE_URL = resolveCanonicalSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/**
 * Returns an absolute URL guaranteed to start with SITE_URL and have a clean single slash.
 */
export function absoluteUrl(path: string = ""): string {
  if (!path || path === "/" || path === ".") {
    return SITE_URL;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Prevent any double slashes at the start of path
  const normalizedPath = cleanPath.replace(/^\/+/, "/");
  return `${SITE_URL}${normalizedPath}`;
}

