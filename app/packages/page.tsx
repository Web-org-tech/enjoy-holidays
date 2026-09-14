import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPublishedPackages } from "@/lib/supabase/queries";
import { getPackageListJsonLd } from "@/lib/structured-data";
import PackagesGrid from "@/components/packages/PackagesGrid";
import { SkeletonCard } from "@/components/ui/Skeleton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Holiday Packages — Explore All Destinations",
  description:
    "Browse all handcrafted holiday packages across India. Filter by destination, duration, and budget. Book Kerala backwaters, Coorg coffee trails, Rajasthan safaris and more.",
  openGraph: {
    title: "Holiday Packages | ENJOY Holidays",
    description:
      "Browse all handcrafted holiday packages across India. Filter by destination, duration, and budget.",
  },
};

async function PackagesList() {
  const packages = await getAllPublishedPackages();
  const jsonLd = getPackageListJsonLd(packages);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackagesGrid packages={packages} />
    </>
  );
}

export default function PackagesPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="pt-36 pb-12 relative overflow-hidden grain-overlay"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="packages-page-heading"
      >
        {/* Decorative compass */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none" aria-hidden="true">
          <svg width="300" height="300" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="0.5" />
            <path d="M20 2 L20 38 M2 20 L38 20" stroke="white" strokeWidth="0.5" />
            <polygon points="20,4 18,20 20,22 22,20" fill="white" />
            <polygon points="20,22 18,20 20,36 22,20" fill="white" opacity="0.4" />
          </svg>
        </div>

        <div className="container-site relative z-10">
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ All Packages</span>
          <h1
            id="packages-page-heading"
            className="display-xl text-white mb-3"
          >
            Find Your Next{" "}
            <span className="italic text-[var(--color-secondary-light)]">Adventure</span>
          </h1>
          <p className="body-lg text-white/70 max-w-xl">
            Every package is crafted from experience — not templates. Filter by destination, duration, or budget and discover your perfect trip.
          </p>
        </div>
      </section>

      {/* Packages grid with filters */}
      <div className="container-site py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          }
        >
          <PackagesList />
        </Suspense>
      </div>

      <div className="h-20 md:h-0 block md:hidden" aria-hidden="true" />
    </>
  );
}
