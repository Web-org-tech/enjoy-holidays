import type { Package, PackageWithDays } from "@/lib/supabase/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://enjoyholidays.in";
const SITE_NAME = "ENJOY Holidays";

// ─── LocalBusiness JSON-LD ────────────────────────────────────────────────────
export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Premium handcrafted holiday packages across India. Backwaters, beaches, hill stations and beyond.",
    telephone: "+91-99999-99999",
    email: "hello@enjoyholidays.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Travel Lane",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      postalCode: "682001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.9312,
      longitude: 76.2673,
    },
    openingHours: "Mo-Sa 09:00-19:00",
    sameAs: [
      "https://instagram.com/enjoyholidays",
      "https://facebook.com/enjoyholidays",
    ],
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

// ─── TouristTrip JSON-LD (per package) ────────────────────────────────────────
export function getPackageJsonLd(pkg: PackageWithDays | Package) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.summary,
    url: `${SITE_URL}/packages/${pkg.slug}`,
    image: pkg.hero_image_url ?? undefined,
    touristType: "Leisure",
    itinerary: {
      "@type": "ItemList",
      itemListElement: pkg.destinations.map((dest, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: dest,
      })),
    },
    offers: {
      "@type": "Offer",
      price: pkg.price_with_food,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "TravelAgency",
        name: SITE_NAME,
      },
    },
    provider: {
      "@type": "TravelAgency",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// ─── ItemList JSON-LD (packages listing) ──────────────────────────────────────
export function getPackageListJsonLd(packages: Pick<Package, "name" | "slug" | "hero_image_url">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Holiday Packages — ${SITE_NAME}`,
    url: `${SITE_URL}/packages`,
    itemListElement: packages.map((pkg, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/packages/${pkg.slug}`,
      name: pkg.name,
      image: pkg.hero_image_url ?? undefined,
    })),
  };
}

// ─── BreadcrumbList JSON-LD ───────────────────────────────────────────────────
export function getBreadcrumbJsonLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}
