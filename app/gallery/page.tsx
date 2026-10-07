import type { Metadata } from "next";
import Image from "next/image";
import { getAllGalleryItems } from "@/lib/supabase/queries";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Gallery — Through the Lens of Our Journeys",
  description:
    "Explore stunning photos and videos from our holiday destinations — Kerala backwaters, Coorg highlands, Goa beaches and more.",
};

export default async function GalleryPage() {
  const items = await getAllGalleryItems();

  return (
    <>
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
