"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { PackageCardData } from "@/lib/supabase/types";
import PackageCard from "@/components/packages/PackageCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PackagesCarouselProps {
  packages: PackageCardData[];
}

export default function PackagesCarousel({ packages }: PackagesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (packages.length === 0) return null;

  return (
    <section
      className="py-20 overflow-hidden"
      style={{ background: "var(--color-background)" }}
      aria-labelledby="featured-packages-heading"
    >
      <div className="container-site">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <span className="label text-[var(--color-primary)] mb-2 block">
              ✦ Curated for You
            </span>
            <h2
              id="featured-packages-heading"
              className="display-xl text-[var(--color-text-primary)]"
            >
              Featured{" "}
              <span className="italic text-[var(--color-primary)]">Journeys</span>
            </h2>
            <p className="body-md text-[var(--color-text-muted)] mt-2 max-w-lg">
              Handpicked experiences across India&apos;s most stunning landscapes.
            </p>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
              aria-label="Scroll packages left"
              id="carousel-prev"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
              aria-label="Scroll packages right"
              id="carousel-next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable container — full width bleed on mobile */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 pl-6 pr-6 md:pl-12 md:pr-12 lg:pl-[calc((100vw-1280px)/2+48px)] scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        role="list"
        aria-label="Featured holiday packages"
      >
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            className="flex-shrink-0 w-[300px] md:w-[340px]"
            role="listitem"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.1, 0.4) }}
          >
            <PackageCard pkg={pkg} priority={i < 2} />
          </motion.div>
        ))}
      </div>

      {/* View all link */}
      <div className="container-site mt-10 text-center">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 hover:scale-105"
          id="view-all-packages"
        >
          View All Packages
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
