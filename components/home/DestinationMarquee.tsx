"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, Compass } from "lucide-react";

export const DESTINATIONS = [
  { name: "Madurai Heritage", state: "Tamil Nadu", tag: "Meenakshi Amman & Palaces" },
  { name: "Rameswaram Coastal", state: "Tamil Nadu", tag: "Pamban Bridge & Sacred Shrines" },
  { name: "Kodaikanal Hills", state: "Tamil Nadu", tag: "Princess of Hill Stations" },
  { name: "Kanyakumari", state: "Tamil Nadu", tag: "Sunrise & Triveni Sangam" },
  { name: "Munnar Tea Gardens", state: "Kerala", tag: "Rolling Green Hills & Mist" },
  { name: "Kerala Backwaters", state: "Kerala", tag: "Houseboats & Lagoons" },
  { name: "Ooty Hills", state: "Tamil Nadu", tag: "Nilgiri Mountain Railways" },
  { name: "Coorg Highlands", state: "Karnataka", tag: "Coffee Plantations & Waterfalls" },
  { name: "Pondicherry", state: "Tamil Nadu", tag: "French Quarter & Promenade" },
  { name: "Mysore Heritage", state: "Karnataka", tag: "Royal Palaces & Gardens" },
  { name: "Goa Beaches", state: "Goa", tag: "Golden Coast & Heritage" },
  { name: "Rajasthan Palaces", state: "Rajasthan", tag: "Forts, Palaces & Desert" },
  { name: "Himachal Valleys", state: "Himachal", tag: "Snow Peaks & Mountain Trails" },
  { name: "Varanasi Ghats", state: "Uttar Pradesh", tag: "Spiritual Ganges & Ganga Aarti" },
  { name: "Andaman Islands", state: "Andaman", tag: "Coral Reefs & Blue Waters" },
];

export default function DestinationMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  // Triple destinations for seamless infinite scroll
  const displayItems = [...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS];

  // Pause when off-screen to preserve CPU & smooth frame rates
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
    const el = scrollContainerRef.current;
    if (!el) return;

    let lastTimestamp = performance.now();
    let accumulatedPos = el.scrollLeft;
    const speed = 0.85;

    const step = (timestamp: number) => {
      const delta = Math.min(timestamp - lastTimestamp, 32);
      lastTimestamp = timestamp;

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

  // Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = () => {
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  // Manual arrow navigation
  const scrollByAmount = useCallback((amount: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 my-6 sm:my-10 relative overflow-hidden select-none"
      style={{
        background: "linear-gradient(180deg, #093E3A 0%, #0B4F4A 50%, #083733 100%)",
      }}
      aria-label="Popular destinations across India"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Decorative background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with generous margin */}
      <div className="container-site mb-8 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
            <Compass size={15} className="animate-spin-slow" />
            <span>Discover India With Us</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mt-2">
            Iconic Destinations &amp; Scenic Circuits
          </h2>
        </div>

        {/* Manual navigation controls */}
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs hidden sm:inline mr-2">
            Auto-sliding • Swipe or use arrows to explore
          </span>
          <button
            type="button"
            onClick={() => scrollByAmount(-320)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(320)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Track */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex items-stretch gap-5 sm:gap-6 overflow-x-auto no-scrollbar scrollbar-hide px-6 py-2 cursor-grab ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{
          scrollBehavior: isDragging ? "auto" : "smooth",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {displayItems.map((item, idx) => (
          <Link
            key={`${item.name}-${idx}`}
            href={`/packages?search=${encodeURIComponent(item.name)}`}
            className="flex-shrink-0 group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between w-[270px] sm:w-[300px]"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#FBBF24]">
                  {item.state}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-[#D45C33] group-hover:text-white transition-all flex-shrink-0">
                  <MapPin size={14} />
                </div>
              </div>
              <h3 className="text-white font-serif text-base sm:text-lg font-bold group-hover:text-[#FBBF24] transition-colors leading-snug">
                {item.name}
              </h3>
              <p className="text-white/75 text-xs sm:text-sm mt-2 leading-relaxed">
                {item.tag}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-white/60 group-hover:text-white/90 transition-colors">
              <span>View Packages</span>
              <span className="text-[#FBBF24] group-hover:translate-x-1 transition-transform inline-block">→</span>
            </div>

            {/* Glowing border highlight on hover */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#FBBF24]/50 pointer-events-none transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
