import type { Metadata } from "next";
import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import PackagesCarousel from "@/components/home/PackagesCarousel";
import TrustBadges from "@/components/home/TrustBadges";
import TestimonialsStrip from "@/components/home/TestimonialsStrip";
import DestinationMarquee from "@/components/home/DestinationMarquee";
import FaqSection from "@/components/home/FaqSection";
import { HOME_FAQS } from "@/lib/faqs";
import { getFeaturedPackages, getPublishedTestimonials, getSiteSettings } from "@/lib/supabase/queries";
import { getLocalBusinessJsonLd, getWebsiteJsonLd, getFaqPageJsonLd } from "@/lib/structured-data";
import { SkeletonCard } from "@/components/ui/Skeleton";
import TourLoader from "@/components/ui/TourLoader";
import ScrollReveal from "@/components/ui/ScrollReveal";

import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "PADMA TOURS & TRAVELS — Daily Tours, Sightseeing & Packages (Est. 2004)",
  description:
    "Trusted travel agency in Madurai since 2004. Daily tours, Madurai local sightseeing, temple circuits, car rental with driver, and customized holiday packages across South India. Available 24 hours.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "PADMA TOURS & TRAVELS — Daily Tours, Sightseeing & Packages (Est. 2004)",
    description:
      "Trusted travel agency in Madurai since 2004. Daily tours, Madurai local sightseeing, temple circuits, and customized holiday packages across South India. Available 24 hours.",
    url: absoluteUrl("/"),
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "PADMA TOURS & TRAVELS — Madurai Travel Agency Since 2004",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PADMA TOURS & TRAVELS — Daily Tours & Madurai Sightseeing",
    description:
      "Daily tours, Madurai local sightseeing, car rental with driver, and South India tour packages. Available 24/7.",
    images: [absoluteUrl("/og-image.png")],
  },
};

export const revalidate = 3600; // ISR: revalidate every hour

async function FeaturedPackages({ featuredIds }: { featuredIds?: string[] }) {
  const packages = await getFeaturedPackages(featuredIds);
  return <PackagesCarousel packages={packages} />;
}

export default async function HomePage() {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublishedTestimonials(),
  ]);

  const heroContent = settings?.hero_content;
  const featuredIds = settings?.featured_package_ids ?? undefined;
  const whatsappNumber = settings?.contact_info?.whatsapp_number;

  // Derive genuine review statistics from published testimonials (never fabricated)
  const reviewStats =
    testimonials.length > 0
      ? {
          ratingValue: (
            testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length
          ).toFixed(1),
          reviewCount: testimonials.length,
        }
      : undefined;

  const jsonLd = getLocalBusinessJsonLd(reviewStats);
  const websiteJsonLd = getWebsiteJsonLd();
  const faqJsonLd = getFaqPageJsonLd(HOME_FAQS);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
      <ScrollReveal direction="up" distance={30}>
        <DestinationMarquee />
      </ScrollReveal>

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
        <TestimonialsStrip testimonials={testimonials} />
      </ScrollReveal>

      {/* ── Frequently Asked Questions ────────────────────────────── */}
      <ScrollReveal direction="up" distance={30}>
        <FaqSection />
      </ScrollReveal>

      {/* ── Bottom padding for mobile nav ────────────────────────── */}
      <div className="h-safe md:h-0 block md:hidden" style={{ height: 80 }} aria-hidden="true" />
    </>
  );
}
