import type { Package, PackageWithDays } from "@/lib/supabase/types";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const SITE_NAME = "PADMA TOURS & TRAVELS";

export interface ReviewStats {
  ratingValue: string;
  reviewCount: number;
}

// ─── LocalBusiness / TravelAgency JSON-LD ──────────────────────────────────────
export function getLocalBusinessJsonLd(stats?: ReviewStats) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#travelagency`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/og-image.png"),
    description:
      "Premier travel agency in Madurai since 2004. Offering daily tours, temple pilgrimages, Madurai local sightseeing, cab rentals with drivers, and customized package tours across South India. Available 24/7.",
    telephone: "+91-9865987975",
    email: "nirmalharish1980@gmail.com",
    foundingDate: "2004",
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [
      "https://wa.me/917010111256",
      "https://www.instagram.com/padma_tours_and_travels_?stkn=YTV1bmx2OGpkeXBy",
      "https://www.facebook.com/share/1CYGDUN1MB/?mibextid=wwXIfr",
    ],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI, Net Banking",
    areaServed: [
      { "@type": "City", name: "Madurai" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "State", name: "Kerala" },
      { "@type": "Country", name: "India" },
    ],
  };

  // Only emit aggregateRating if genuine reviews are present
  if (stats && stats.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: stats.ratingValue,
      reviewCount: stats.reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

// ─── WebSite JSON-LD ──────────────────────────────────────────────────────────
export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
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

// ─── AboutPage JSON-LD ────────────────────────────────────────────────────────
export function getAboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#webpage`,
    name: `About Us — ${SITE_NAME} (Est. 2004)`,
    url: absoluteUrl("/about"),
    description:
      "Founded in 2004 in Madurai, PADMA TOURS & TRAVELS provides trusted daily tours, local sightseeing, cab services, and customized holiday packages across South India.",
    mainEntity: {
      "@type": "TravelAgency",
      name: SITE_NAME,
      url: SITE_URL,
      foundingDate: "2004",
      telephone: "+91-9865987975",
    },
  };
}

// ─── ContactPage JSON-LD ──────────────────────────────────────────────────────
export function getContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#webpage`,
    name: `Contact Us — ${SITE_NAME} (Madurai • 24/7 Service)`,
    url: absoluteUrl("/contact"),
    description:
      "Get in touch with PADMA TOURS & TRAVELS in Madurai. Available 24 hours a day for daily tours, sightseeing, and holiday packages across India.",
    mainEntity: {
      "@type": "TravelAgency",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: "+91-9865987975",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-9865987975",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Tamil"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+91-7010111256",
          contactType: "reservations",
          contactOption: "WhatsApp",
          areaServed: "IN",
          availableLanguage: ["English", "Tamil"],
        },
      ],
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
    url: absoluteUrl(`/packages/${pkg.slug}`),
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
    url: absoluteUrl("/packages"),
    itemListElement: packages.map((pkg, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/packages/${pkg.slug}`),
      name: pkg.name,
      image: pkg.hero_image_url ?? undefined,
    })),
  };
}

// ─── BreadcrumbList JSON-LD ───────────────────────────────────────────────────
export function getBreadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

// ─── FAQPage JSON-LD ──────────────────────────────────────────────────────────
export function getFaqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

