import type { Metadata } from "next";
import Image from "next/image";
import { getAllGalleryItems } from "@/lib/supabase/queries";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { absoluteUrl } from "@/lib/site";

import { getBreadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tour Gallery — Destination Photos & Moments | PADMA TOURS & TRAVELS",
  description:
    "Explore photos from our holiday destinations across South India — Madurai temples, Rameswaram, Kerala backwaters, Coorg, and Ooty hills.",
  alternates: {
    canonical: absoluteUrl("/gallery"),
  },
  openGraph: {
    title: "Tour Gallery — Destination Photos & Moments | PADMA TOURS & TRAVELS",
    description:
      "Explore photos from our holiday destinations across South India — Madurai temples, Rameswaram, Kerala backwaters, Coorg, and Ooty hills.",
    url: absoluteUrl("/gallery"),
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "PADMA TOURS & TRAVELS Tour Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Gallery | PADMA TOURS & TRAVELS",
    description: "Explore destination photos across Madurai, Kerala, and South India.",
    images: [absoluteUrl("/og-image.png")],
  },
};

export default async function GalleryPage() {
  const items = await getAllGalleryItems();
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Header */}
      <section
        className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 grain-overlay overflow-hidden"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="gallery-page-heading"
      >
        <div className="container-site relative z-10">
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ Visual Journal</span>
          <h1 id="gallery-page-heading" className="display-xl text-white mb-4">
            Through the <span className="italic text-[var(--color-secondary-light)]">Lens</span>
          </h1>
          <p className="body-lg text-white/80 max-w-xl leading-relaxed">
            Every photo tells a story. Browse moments captured across India&apos;s most extraordinary destinations.
          </p>
        </div>

        {/* Decorative subtle bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden pointer-events-none opacity-40">
          <svg viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,24 C360,8 1080,8 1440,24 L1440,24 L0,24 Z" fill="#FAF7F2" />
          </svg>
        </div>
      </section>

      {/* Main Gallery Section with clear breathing room */}
      <section className="container-site py-12 sm:py-16 min-h-[50vh]">
        <GalleryGrid items={items} />
      </section>

      <div className="h-20 md:h-0 block md:hidden" aria-hidden="true" />
    </>
  );
}
