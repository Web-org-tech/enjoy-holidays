import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, MapPin, ChevronRight, MessageCircle, Phone, ChevronDown } from "lucide-react";
import { getPackageBySlug, getAllPackageSlugs, getSimilarPackages } from "@/lib/supabase/queries";
import { getPackageJsonLd, getBreadcrumbJsonLd } from "@/lib/structured-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import JourneyRoad from "@/components/journey/JourneyRoad";
import PackageCard from "@/components/packages/PackageCard";
import Badge from "@/components/ui/Badge";
import InclusionsCard from "@/components/packages/InclusionsCard";
import PackageGalleryStrip from "@/components/packages/PackageGalleryStrip";
import StickyEnquireCTA from "@/components/packages/StickyEnquireCTA";
import EnquiryForm from "@/components/packages/EnquiryForm";

export const revalidate = 3600;

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPackageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Package Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://enjoyholidays.in";

  return {
    title: pkg.seo_title ?? `${pkg.name} — ${pkg.duration_days}D/${pkg.duration_nights}N | ENJOY Holidays`,
    description: pkg.seo_description ?? pkg.summary,
    openGraph: {
      title: pkg.name,
      description: pkg.summary,
      images: pkg.hero_image_url ? [{ url: pkg.hero_image_url, width: 1200, height: 630 }] : [],
      type: "website",
      url: `${siteUrl}/packages/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: pkg.name,
      description: pkg.summary,
      images: pkg.hero_image_url ? [pkg.hero_image_url] : [],
    },
  };
}

export default async function PackageDetailPage({ params }: Params) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const similar = await getSimilarPackages(slug, pkg.destinations);
  const waUrl = buildWhatsAppUrl({ packageName: pkg.name });
  const jsonLd = getPackageJsonLd(pkg);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: pkg.name, href: `/packages/${slug}` },
  ]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Sticky enquire CTA (mobile) */}
      <StickyEnquireCTA packageName={pkg.name} waUrl={waUrl} />

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden" aria-label="Package hero">
        {/* Hero image */}
        <div className="absolute inset-0">
          {pkg.hero_image_url ? (
            <Image
              src={pkg.hero_image_url}
              alt={pkg.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-terracotta-200 to-amber-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>

        {/* Breadcrumb */}
        <nav
          className="absolute top-24 left-0 right-0 container-site"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2 text-white/60 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <ChevronRight size={12} />
            <li><Link href="/packages" className="hover:text-white transition-colors">Packages</Link></li>
            <ChevronRight size={12} />
            <li className="text-white font-medium truncate max-w-[200px]">{pkg.name}</li>
          </ol>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 container-site pb-12 pt-32">
          {/* Destination tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pkg.destinations.map((dest) => (
              <Badge key={dest} variant="white" size="md">
                <MapPin size={11} className="mr-0.5" /> {dest}
              </Badge>
            ))}
          </div>

          <h1 className="display-xl text-white mb-3 max-w-3xl">
            {pkg.name}
          </h1>
          <p className="body-lg text-white/80 max-w-2xl mb-6 line-clamp-2">{pkg.summary}</p>

          {/* Quick badges row */}
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="secondary" size="lg">
              <Clock size={14} className="mr-1" />
              {pkg.duration_days} Days / {pkg.duration_nights} Nights
            </Badge>
            <Badge variant="accent" size="lg">
              <Users size={14} className="mr-1" />
              Max {pkg.pax_capacity} Pax
            </Badge>
            <div className="glass px-4 py-2 rounded-full">
              <span className="text-white/70 text-xs">From</span>
              <span className="text-white font-bold text-xl ml-2">
                ₹{pkg.price_with_food.toLocaleString("en-IN")}
              </span>
              <span className="text-white/70 text-xs">/person</span>
            </div>

            {/* Desktop WhatsApp CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-[#25d366] text-white font-bold text-sm hover:bg-[#1da853] transition-colors shadow-lg"
              id="hero-whatsapp-pkg"
            >
              <MessageCircle size={16} />
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK FACTS BAR ──────────────────────────────────── */}
      <section
        className="py-6 border-b border-[var(--color-border)]"
        style={{ background: "white" }}
        aria-label="Package quick facts"
      >
        <div className="container-site grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: "Duration", value: `${pkg.duration_days}D / ${pkg.duration_nights}N` },
            { icon: Users, label: "Group Size", value: `Up to ${pkg.pax_capacity} people` },
            {
              icon: MapPin,
              label: "Starting Price",
              value: `₹${pkg.price_with_food.toLocaleString("en-IN")} with meals`,
            },
            {
              icon: MessageCircle,
              label: "Price (No Meals)",
              value: pkg.price_without_food
                ? `₹${pkg.price_without_food.toLocaleString("en-IN")}`
                : "On request",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--color-primary)/8", backgroundColor: "rgba(212,92,51,0.08)" }}
              >
                <Icon size={18} style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium">{label}</div>
                <div className="text-sm font-bold text-[var(--color-text-primary)]">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. THE JOURNEY (signature scroll animation) ──────────── */}
      <section
        className="py-20"
        style={{ background: "var(--color-background)" }}
        aria-labelledby="journey-heading"
        id="itinerary"
      >
        <div className="container-site">
          <div className="text-center mb-14">
            <span className="label text-[var(--color-primary)] mb-2 block">✦ Day by Day</span>
            <h2 id="journey-heading" className="display-xl text-[var(--color-text-primary)]">
              Your <span className="italic text-[var(--color-primary)]">Journey</span>
            </h2>
            <p className="body-md text-[var(--color-text-muted)] max-w-md mx-auto mt-2">
              Scroll through each day of your adventure. Click any stop to reveal the full itinerary.
            </p>
          </div>

          {pkg.package_days && pkg.package_days.length > 0 ? (
            <JourneyRoad
              days={pkg.package_days}
              vehicleType={pkg.vehicle_type}
            />
          ) : (
            <p className="text-center text-[var(--color-text-muted)]">
              Itinerary coming soon. Contact us for details.
            </p>
          )}
        </div>
      </section>

      {/* ── 4. INCLUSIONS vs EXCLUSIONS ─────────────────────────── */}
      <section
        className="py-16"
        style={{ background: "var(--color-surface-alt)" }}
        aria-labelledby="inclusions-heading"
      >
        <div className="container-site">
          <div className="text-center mb-10">
            <span className="label text-[var(--color-primary)] mb-2 block">✦ What&apos;s Included</span>
            <h2 id="inclusions-heading" className="display-lg text-[var(--color-text-primary)]">
              Package <span className="italic text-[var(--color-primary)]">Inclusions</span>
            </h2>
          </div>
          <InclusionsCard
            inclusions={pkg.package_inclusions}
            exclusions={pkg.package_exclusions}
          />
        </div>
      </section>

      {/* ── 5. GALLERY STRIP ────────────────────────────────────── */}
      {pkg.gallery_items && pkg.gallery_items.length > 0 && (
        <section className="py-16" aria-labelledby="gallery-heading">
          <div className="container-site">
            <div className="mb-8">
              <span className="label text-[var(--color-primary)] mb-2 block">✦ Through the Lens</span>
              <h2 id="gallery-heading" className="display-lg text-[var(--color-text-primary)]">
                Package <span className="italic text-[var(--color-primary)]">Gallery</span>
              </h2>
            </div>
            <PackageGalleryStrip items={pkg.gallery_items} />
          </div>
        </section>
      )}

      {/* ── 6. TERMS / NOTES ────────────────────────────────────── */}
      {pkg.notes && (
        <section className="py-8 border-t border-[var(--color-border)]" aria-labelledby="terms-heading">
          <div className="container-site max-w-3xl mx-auto">
            <details className="group">
              <summary
                className="flex items-center justify-between cursor-pointer list-none py-3 font-semibold text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                id="terms-heading"
              >
                <span>Important Notes & Terms</span>
                <ChevronDown
                  size={16}
                  className="transition-transform duration-200 group-open:rotate-180 text-[var(--color-text-muted)]"
                />
              </summary>
              <div className="pb-4 pt-2">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                  {pkg.notes}
                </p>
              </div>
            </details>
          </div>
        </section>
      )}

      {/* ── 7. BOOKING CTA ──────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="booking-heading"
        id="enquire"
      >
        <div className="container-site max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="label text-[var(--color-secondary-light)] mb-2 block">✦ Ready to Go?</span>
            <h2 id="booking-heading" className="display-xl text-white">
              Book Your <span className="italic text-[var(--color-secondary-light)]">Adventure</span>
            </h2>
            <p className="body-lg text-white/70 mt-3 max-w-lg mx-auto">
              Reach us on WhatsApp for instant confirmation or fill the form and we&apos;ll call you back within 2 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* WhatsApp CTA */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div className="w-16 h-16 rounded-full bg-[#25d366] flex items-center justify-center mx-auto mb-5 shadow-xl">
                <MessageCircle size={28} className="text-white" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">WhatsApp Us</h3>
              <p className="text-white/60 text-sm mb-6">Fastest response. Usually within minutes.</p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#25d366] text-white font-bold hover:bg-[#1da853] transition-colors text-base w-full justify-center shadow-lg"
                id="booking-whatsapp-cta"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:+${whatsappNumber}`}
                className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white/70 font-medium text-sm hover:text-white transition-colors w-full justify-center"
              >
                <Phone size={14} />
                Or call us directly
              </a>
            </div>

            {/* Lead form */}
            <EnquiryForm packageId={pkg.id} packageName={pkg.name} />
          </div>
        </div>
      </section>

      {/* ── 8. SIMILAR PACKAGES ─────────────────────────────────── */}
      {similar.length > 0 && (
        <section
          className="py-20"
          style={{ background: "var(--color-background)" }}
          aria-labelledby="similar-heading"
        >
          <div className="container-site">
            <div className="mb-10">
              <span className="label text-[var(--color-primary)] mb-2 block">✦ You Might Also Like</span>
              <h2 id="similar-heading" className="display-lg text-[var(--color-text-primary)]">
                Similar <span className="italic text-[var(--color-primary)]">Packages</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile bottom nav padding */}
      <div className="h-20 md:h-0 block md:hidden" aria-hidden="true" />
    </>
  );
}
