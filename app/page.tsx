import type { Metadata } from "next";
import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import PackagesCarousel from "@/components/home/PackagesCarousel";
import TrustBadges from "@/components/home/TrustBadges";
import TestimonialsStrip from "@/components/home/TestimonialsStrip";
import DestinationMarquee from "@/components/home/DestinationMarquee";
import { getFeaturedPackages, getPublishedTestimonials, getSiteSettings } from "@/lib/supabase/queries";
import { getLocalBusinessJsonLd, getWebsiteJsonLd } from "@/lib/structured-data";
import { SkeletonCard } from "@/components/ui/Skeleton";
import TourLoader from "@/components/ui/TourLoader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "PADMA TOURS & TRAVELS — Daily Tours, Sightseeing & Packages (Est. 2004)",
  description:
    "Trusted travel agency in Madurai since 2004. Daily tours, Madurai local sightseeing, temple circuits, and customized holiday packages across South India. Available 24 hours.",
};

export const revalidate = 3600; // ISR: revalidate every hour

async function FeaturedPackages({ featuredIds }: { featuredIds?: string[] }) {
  const packages = await getFeaturedPackages(featuredIds);
  return <PackagesCarousel packages={packages} />;
}

async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  return <TestimonialsStrip testimonials={testimonials} />;
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const heroContent = settings?.hero_content;
  const featuredIds = settings?.featured_package_ids ?? undefined;
  const whatsappNumber = settings?.contact_info?.whatsapp_number;

  const jsonLd = getLocalBusinessJsonLd();
  const websiteJsonLd = getWebsiteJsonLd();

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroSection
        headline={heroContent?.headline}
        subtext={heroContent?.subtext}
        backgroundMediaUrl={heroContent?.background_media_url}
        backgroundMediaType={heroContent?.background_media_type}
        ctaPrimaryLabel={heroContent?.cta_primary_label}
        ctaSecondaryLabel={heroContent?.cta_secondary_label}
        whatsappNumber={whatsappNumber}
      />

      {/* ── Destination Marquee ────────────────────────────────────── */}
      <DestinationMarquee />

      {/* ── Services Offered (Daily Tour, Local Sightseeing, Packages) ── */}
      <ScrollReveal direction="up" distance={40}>
        <ServicesSection />
      </ScrollReveal>

      {/* ── Featured Packages ─────────────────────────────────────── */}
      <ScrollReveal direction="up" distance={40} delay={0.1}>
        <Suspense
          fallback={
            <div className="py-20 container-site grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          }
        >
          <FeaturedPackages featuredIds={featuredIds ?? undefined} />
        </Suspense>
      </ScrollReveal>

      {/* ── Trust Badges ─────────────────────────────────────────── */}
      <ScrollReveal direction="up" distance={30}>
        <TrustBadges />
      </ScrollReveal>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <ScrollReveal direction="up" distance={30}>
        <Suspense
          fallback={
            <div className="py-16 flex items-center justify-center">
              <TourLoader label="Gathering verified guest stories..." />
            </div>
          }
        >
          <Testimonials />
        </Suspense>
      </ScrollReveal>

      {/* ── Bottom padding for mobile nav ────────────────────────── */}
      <div className="h-safe md:h-0 block md:hidden" style={{ height: 80 }} aria-hidden="true" />
    </>
  );
}
