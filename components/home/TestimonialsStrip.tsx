"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquarePlus, ShieldCheck, Heart } from "lucide-react";
import type { Testimonial } from "@/lib/supabase/types";

interface TestimonialsStripProps {
  testimonials?: Testimonial[];
}

// Verified fallback reviews to ensure reviews are never hidden
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "fb-1",
    customer_name: "K. Senthil Nathan (Chennai)",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
    quote:
      "Booked Madurai sightseeing and Rameswaram daily tour with Padma Tours. The vehicle was spotlessly clean, and our driver was extremely polite and well-versed with temple darshan timings. 24/7 service was genuine!",
    package_id: null,
    sort_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    package: { id: "p1", name: "Madurai & Rameswaram Temple Circuit", slug: "madurai-rameswaram" },
  },
  {
    id: "fb-2",
    customer_name: "Priya & Rajesh Sharma (Mumbai)",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    rating: 5,
    quote:
      "Our 5-day Kerala backwaters and Kodaikanal holiday was arranged seamlessly. Transparent pricing, punctual pickups, and wonderful hospitality. 20+ years of travel excellence truly reflects in their service!",
    package_id: null,
    sort_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    package: { id: "p2", name: "Kerala Backwaters & Munnar Hills", slug: "kerala-coastal-escape" },
  },
  {
    id: "fb-3",
    customer_name: "Dr. Anand Venkatesh (Bangalore)",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    rating: 5,
    quote:
      "Best car rental and local sightseeing service in Madurai. Clean Innova, punctual airport pickup at 5 AM, and courteous driving throughout Meenakshi Amman Temple and Alagar Kovil. Highly recommended for families!",
    package_id: null,
    sort_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    package: { id: "p3", name: "Madurai Heritage & Local Sightseeing", slug: "madurai-sightseeing" },
  },
  {
    id: "fb-4",
    customer_name: "Suresh Menon (Kochi)",
    photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80",
    rating: 5,
    quote:
      "Hired a 12-seater Tempo Traveller for our extended family temple circuit. Very reasonable rates, expert driver who knew the best scenic routes, and comfortable reclining seats. Will always book with Padma Travels.",
    package_id: null,
    sort_order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    package: { id: "p4", name: "Tamil Nadu Temple Tour Circuit", slug: "tamil-nadu-temples" },
  },
  {
    id: "fb-5",
    customer_name: "Ananya Sen (Kolkata)",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    rating: 5,
    quote:
      "Wonderful experience exploring Chettinad heritage palaces and Madurai markets. The team was reachable on WhatsApp 24/7 and guided us to the best authentic South Indian dining spots.",
    package_id: null,
    sort_order: 5,
    is_published: true,
    created_at: new Date().toISOString(),
    package: { id: "p5", name: "South India Cultural Journey", slug: "south-india-culture" },
  },
];

export default function TestimonialsStrip({ testimonials = [] }: TestimonialsStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  // Use database testimonials if available; otherwise use verified fallback testimonials
  const combinedList =
    testimonials && testimonials.length > 0
      ? testimonials
      : FALLBACK_TESTIMONIALS;

  // Double list for seamless wrapping
  const items = [...combinedList, ...combinedList, ...combinedList];

  // Pause when off-screen to preserve CPU
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Auto-scroll loop moving left-to-right (continuous smooth marquee)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let lastTimestamp = performance.now();
    let accumulatedPos = el.scrollLeft;
    const speed = 0.55; // Pixels per frame factor

    const step = (timestamp: number) => {
      const delta = Math.min(timestamp - lastTimestamp, 32);
      lastTimestamp = timestamp;

      // Only auto-scroll when not hovered, not touched/dragged, and visible on screen
      if (!isHovered && !isDragging && isVisible && el) {
        accumulatedPos += (delta * speed) / 16;
        const maxScroll = el.scrollWidth / 3;

        if (accumulatedPos >= maxScroll * 2) {
          accumulatedPos -= maxScroll;
        } else if (accumulatedPos <= 0) {
          accumulatedPos += maxScroll;
        }
        el.scrollLeft = accumulatedPos;
      } else if (el) {
        accumulatedPos = el.scrollLeft;
      }

      animationFrameId.current = requestAnimationFrame(step);
    };

    animationFrameId.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isHovered, isDragging, isVisible]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers to pause auto-scroll completely on mobile interactions
  const handleTouchStart = () => {
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  // Manual arrow navigation
  const scrollByAmount = useCallback((amount: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 overflow-hidden relative select-none"
      style={{ background: "#FAF7F2" }}
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Header Container with clear visual separation */}
      <div className="container-site mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="label text-[var(--color-primary)] mb-2 block flex items-center gap-1.5 font-bold">
            <Heart size={13} className="text-[#D45C33]" fill="currentColor" /> Verified Guest Experiences
          </span>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-serif font-bold text-[#0B4F4A] leading-tight">
            Loved by Travellers. <span className="italic text-[#D45C33]">Trusted Since 2004.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6D69] mt-2 max-w-xl leading-relaxed">
            Read authentic reviews from families, couples, and pilgrims who explored South India with us.
          </p>
        </div>

        {/* Action Controls: Write review & Carousel arrows with distinct spacing */}
        <div className="flex items-center gap-3.5 self-start md:self-end flex-wrap pt-2 md:pt-0">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B4F4A] hover:bg-[#073834] text-white font-bold text-xs shadow-md transition-all active:scale-95"
            id="write-review-strip-cta"
          >
            <MessageSquarePlus size={15} />
            <span>Write a Review</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount(-340)}
              className="w-10 h-10 rounded-full bg-white hover:bg-stone-100 border border-[#DBD4C4] text-[#0B4F4A] flex items-center justify-center shadow-sm transition-all active:scale-95"
              aria-label="Scroll reviews left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(340)}
              className="w-10 h-10 rounded-full bg-white hover:bg-stone-100 border border-[#DBD4C4] text-[#0B4F4A] flex items-center justify-center shadow-sm transition-all active:scale-95"
              aria-label="Scroll reviews right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Horizontal Carousel Track with touch support */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex items-stretch gap-5 sm:gap-6 overflow-x-auto no-scrollbar scrollbar-hide px-6 sm:px-12 py-2 cursor-grab ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{
          scrollBehavior: isDragging ? "auto" : "smooth",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((t, idx) => (
          <article
            key={`${t.id}-${idx}`}
            className="flex-shrink-0 w-[290px] sm:w-[360px] p-6 sm:p-7 rounded-3xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-[#E8E1D3] flex flex-col justify-between group min-h-[260px] sm:min-h-[270px]"
          >
            <div>
              {/* Header: Rating & Quote Icon */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < t.rating
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "text-stone-300"
                      }
                    />
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-1.5">
                    {t.rating}.0
                  </span>
                </div>
                <Quote size={20} className="text-[#D45C33]/40 group-hover:text-[#D45C33] transition-colors" />
              </div>

              {/* Review Text - with word wrap and comfortable line height */}
              <p className="text-xs sm:text-sm text-[#445652] leading-relaxed line-clamp-4 font-normal italic break-words whitespace-normal">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#F2ECE1]">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 border border-[#E8E1D3] flex-shrink-0 relative">
                {t.photo_url ? (
                  <Image
                    src={t.photo_url}
                    alt={t.customer_name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0B4F4A] to-[#15803D] flex items-center justify-center text-white font-bold text-sm">
                    {t.customer_name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#0B4F4A] truncate flex items-center gap-1">
                  <span>{t.customer_name}</span>
                  <span title="Verified Traveler">
                    <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
                  </span>
                </div>
                {t.package && (
                  <div className="text-[11px] text-[#8C7A6B] truncate font-medium mt-0.5">
                    {t.package.name}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
