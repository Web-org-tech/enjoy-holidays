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
        className="pt-36 pb-12 grain-overlay"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="gallery-page-heading"
      >
        <div className="container-site">
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ Visual Journal</span>
          <h1 id="gallery-page-heading" className="display-xl text-white mb-3">
            Through the <span className="italic text-[var(--color-secondary-light)]">Lens</span>
          </h1>
          <p className="body-lg text-white/70 max-w-xl">
            Every photo tells a story. Browse moments captured across India&apos;s most extraordinary destinations.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        <GalleryGrid items={items} />
      </div>

      <div className="h-20 md:h-0 block md:hidden" aria-hidden="true" />
    </>
  );
}
