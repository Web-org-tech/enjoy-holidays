"use client";

import { motion } from "framer-motion";
import type { Testimonial } from "@/lib/supabase/types";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

interface TestimonialsStripProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function TestimonialsStrip({ testimonials }: TestimonialsStripProps) {
  if (testimonials.length === 0) return null;

  // Duplicate for seamless infinite scroll
  const doubled = [...testimonials, ...testimonials];

  return (
    <section
      className="py-20 overflow-hidden"
      style={{ background: "var(--color-surface-alt)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="container-site mb-12 text-center">
        <span className="label text-[var(--color-primary)] mb-2 block">
          ✦ Real Stories
        </span>
        <h2
          id="testimonials-heading"
          className="display-xl text-[var(--color-text-primary)]"
        >
          What Our{" "}
          <span className="italic text-[var(--color-primary)]">Travellers Say</span>
        </h2>
      </div>

      {/* Scrolling strip */}
      <div className="relative" aria-label="Customer testimonials carousel">
        {/* Edge fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, var(--color-surface-alt), transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, var(--color-surface-alt), transparent)",
          }}
        />

        {/* Row 1 */}
        <div className="marquee-track gap-5 mb-5">
          {doubled.map((t, i) => (
            <TestimonialCard key={`row1-${t.id}-${i}`} testimonial={t} />
          ))}
        </div>

        {/* Row 2 (reversed) */}
        <div className="marquee-track marquee-track-reverse gap-5">
          {[...doubled].reverse().map((t, i) => (
            <TestimonialCard key={`row2-${t.id}-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <article
      className="flex-shrink-0 w-[320px] p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-3"
      style={{ border: "1px solid var(--color-border)" }}
    >
      {/* Quote icon */}
      <Quote size={20} className="text-[var(--color-primary-light)]" />

      <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-4 flex-1">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
          {t.photo_url ? (
            <Image
              src={t.photo_url}
              alt={t.customer_name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-terracotta-200 to-amber-200 flex items-center justify-center">
              <span className="text-lg font-serif text-terracotta-600">
                {t.customer_name[0]}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-[var(--color-text-primary)] truncate">
            {t.customer_name}
          </div>
          {t.package && (
            <div className="text-[11px] text-[var(--color-text-muted)] truncate">
              {t.package.name}
            </div>
          )}
        </div>

        <StarRating rating={t.rating} />
      </div>
    </article>
  );
}
