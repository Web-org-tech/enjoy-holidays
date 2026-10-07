import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Star, ShieldCheck, Heart, ArrowRight, Quote } from "lucide-react";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackShareButtons from "@/components/feedback/FeedbackShareButtons";
import { getPublishedTestimonials } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guest Feedback & Reviews — PADMA TOURS & TRAVELS",
  description:
    "Share your travel story and feedback with PADMA TOURS & TRAVELS. Read authentic reviews from families, couples, and pilgrims who traveled with us.",
};

export default async function FeedbackPage() {
  const testimonials = await getPublishedTestimonials();
  const recentReviews = testimonials.slice(0, 6);

  return (
    <>
      {/* ── 1. Page Heading & Hero Banner (Deep Teal) ──────────────────────── */}
      <section
        className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 grain-overlay overflow-hidden"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="feedback-page-heading"
      >
        <div className="container-site max-w-4xl text-center relative z-10 px-4">
          <span className="label text-[var(--color-secondary-light)] mb-3 inline-block">
            ✦ Guest Feedback &amp; Reviews
          </span>

          <h1 id="feedback-page-heading" className="display-xl text-white mb-4">
            How Was Your <span className="italic text-[var(--color-secondary-light)]">Journey With Us?</span>
          </h1>

          <p className="body-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your feedback helps us continue crafting unforgettable travel memories. Please share your rating, photos, and experience with{" "}
            <strong className="text-white">PADMA TOURS &amp; TRAVELS</strong>.
          </p>

          {/* Share buttons */}
          <div className="mt-6 flex justify-center">
            <FeedbackShareButtons />
          </div>
        </div>

        {/* Decorative subtle bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden pointer-events-none opacity-40">
          <svg viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,24 C360,8 1080,8 1440,24 L1440,24 L0,24 Z" fill="#FDFBF7" />
          </svg>
        </div>
      </section>

      {/* ── 2. Review / Feedback Form Card ─────────────────────────────── */}
      <div className="bg-[#FDFBF7] py-12 sm:py-16">
        <section className="container-site max-w-2xl mx-auto px-4">
          <FeedbackForm />
        </section>

      {/* ── 3. Submitted Reviews / Customer Feedback ───────────────────── */}
      {recentReviews.length > 0 && (
        <section className="container-site max-w-6xl mx-auto px-4 mt-16 sm:mt-24 pt-14 border-t border-[#E8E1D3]">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center justify-center gap-1.5 mb-2">
              <Heart size={14} className="text-[#D45C33]" fill="currentColor" /> Verified Guest Experiences
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0B4F4A]">
              Recent Traveler Stories
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6D69] mt-2 max-w-xl mx-auto leading-relaxed">
              Read authentic feedback shared by guests who explored South India and beyond with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReviews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E1D3] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" stroke="none" />
                      ))}
                      <span className="text-xs font-bold text-stone-700 ml-1.5">{item.rating}.0</span>
                    </div>
                    <Quote size={20} className="text-[#D45C33]/30" />
                  </div>

                  <p className="text-xs sm:text-sm text-[#445652] italic leading-relaxed mb-6 break-words whitespace-normal">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2ECE1] flex items-center gap-3">
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
                    <h3 className="font-bold text-xs sm:text-sm text-[#0B4F4A] truncate flex items-center gap-1">
                      <span>{item.customer_name}</span>
                      <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
                    </h3>
                    {item.package && (
                      <Link
                        href={`/packages/${item.package.slug}`}
                        className="text-[11px] text-[#8C7A6B] hover:text-[var(--color-primary)] truncate block mt-0.5"
                      >
                        {item.package.name}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-xs sm:text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 hover:scale-105"
            >
              <span>View All Verified Reviews</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* Safe padding for mobile navbar */}
      <div className="h-16 md:h-0 block md:hidden" aria-hidden="true" />
    </div>
    </>
  );
}
