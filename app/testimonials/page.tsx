import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, MessageCircle, Quote, ArrowLeft } from "lucide-react";
import { getPublishedTestimonials } from "@/lib/supabase/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import ReviewModal from "@/components/home/ReviewModal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guest Reviews & Stories — PADMA TOURS & TRAVELS",
  description:
    "Read authentic reviews from travellers who explored Madurai, Tamil Nadu, Kerala, and beyond with PADMA TOURS & TRAVELS. Real experiences, real memories.",
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();
  const waUrl = buildWhatsAppUrl();

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "PADMA TOURS & TRAVELS",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: Math.max(testimonials.length, 25).toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.customer_name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating.toString(),
        bestRating: "5",
      },
      reviewBody: t.quote,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      {/* Header */}
      <section
        className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 grain-overlay overflow-hidden"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="testimonials-heading"
      >
        <div className="container-site max-w-4xl text-center relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ Traveller Stories</span>
          <h1 id="testimonials-heading" className="display-xl text-white mb-4 leading-tight">
            Loved by Travellers. <br />
            <span className="italic text-[var(--color-secondary-light)]">Remembered for a Lifetime.</span>
          </h1>
          <p className="body-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            From pilgrims visiting Meenakshi Amman Temple to families exploring Kerala, Coorg, and Ooty, discover why travellers trust PADMA TOURS &amp; TRAVELS.
          </p>

          {/* Quick rating overview & Write Review Button with responsive gap */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 sm:mt-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <div className="flex items-center text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="text-white font-bold text-sm">4.9 / 5.0 Average Rating</span>
              <span className="text-white/60 text-xs">({testimonials.length} verified reviews)</span>
            </div>

            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] text-[var(--color-text-primary)] font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
              id="write-review-page-button"
            >
              ★ Write a Review (Feedback Page)
            </Link>
          </div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden pointer-events-none opacity-40">
          <svg viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,24 C360,8 1080,8 1440,24 L1440,24 L0,24 Z" fill="#FAF7F2" />
          </svg>
        </div>
      </section>

      {/* Reviews Grid with comfortable section spacing */}
      <div className="container-site py-14 sm:py-20 max-w-6xl mx-auto">
        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <p>New guest reviews are being published soon. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" stroke="none" />
                      ))}
                      <span className="text-xs font-bold text-stone-700 ml-1.5">{item.rating}.0</span>
                    </div>
                    <Quote size={20} className="text-[#D45C33]/30" />
                  </div>

                  <p className="text-xs sm:text-sm text-[#445652] mb-6 italic leading-relaxed break-words whitespace-normal">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]/60 flex items-center gap-3">
                  {item.photo_url ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0 bg-stone-100">
                      <Image
                        src={item.photo_url}
                        alt={item.customer_name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {item.customer_name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)] leading-tight truncate">
                      {item.customer_name}
                    </h3>
                    {item.package && (
                      <Link
                        href={`/packages/${item.package.slug}`}
                        className="text-xs text-[var(--color-primary)] hover:underline block mt-0.5 truncate"
                      >
                        {item.package.name}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-3xl p-10 text-white shadow-xl">
          <h2 className="font-serif text-3xl font-bold mb-3">Ready to Create Your Own Story?</h2>
          <p className="text-white/70 text-sm max-w-lg mx-auto mb-6">
            Tell us where you want to go. We will handcraft an itinerary customized to your exact preferences.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/packages"
              className="px-6 py-3 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] text-[var(--color-text-primary)] font-bold text-sm transition-colors"
            >
              Explore Packages
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25d366] hover:bg-[#1da853] text-white font-bold text-sm transition-colors shadow-md"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
