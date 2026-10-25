import type { Package, PackageWithDays } from "@/lib/supabase/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://padmatoursandtravels.in";
const SITE_NAME = "PADMA TOURS & TRAVELS";

// ─── LocalBusiness JSON-LD ────────────────────────────────────────────────────
export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description:
      "Premier travel agency in Madurai since 2004. Offering daily tours, temple pilgrimages, local sightseeing, and customized package tours across South India and All India. 24/7 service.",
    telephone: "+91-9865987975",
    email: "nirmalharish1980@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters",
      addressLocality: "Madurai",
      addressRegion: "Tamil Nadu",
      postalCode: "625002",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.9252,
      longitude: 78.1198,
    },
    openingHours: "Mo-Su 00:00-24:00",
    sameAs: [
      "https://wa.me/917010111256",
    ],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI, Net Banking",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "148",
      bestRating: "5",
      worstRating: "1",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

// ─── WebSite JSON-LD ──────────────────────────────────────────────────────────
export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/packages?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
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
