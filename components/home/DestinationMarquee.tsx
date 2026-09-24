"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, Compass } from "lucide-react";

export const DESTINATIONS = [
  { name: "Kerala Backwaters", state: "Kerala", tag: "Houseboats & Lagoons" },
  { name: "Coorg Highlands", state: "Karnataka", tag: "Coffee & Mist" },
  { name: "Rajasthan Desert", state: "Rajasthan", tag: "Dunes & Forts" },
  { name: "Goa Beaches", state: "Goa", tag: "Sun, Sand & Waves" },
  { name: "Himachal Peaks", state: "Himachal", tag: "Snow & Valleys" },
  { name: "Ooty Hills", state: "Tamil Nadu", tag: "Nilgiri Queen" },
  { name: "Andaman Islands", state: "Andaman", tag: "Coral Reefs" },
  { name: "Pondicherry", state: "Tamil Nadu", tag: "French Riviera" },
  { name: "Munnar Tea Gardens", state: "Kerala", tag: "Rolling Green Hills" },
  { name: "Varanasi Ghats", state: "Uttar Pradesh", tag: "Spiritual Ganges" },
  { name: "Jaipur Palaces", state: "Rajasthan", tag: "Pink City Heritage" },
  { name: "Ladakh Mountains", state: "Ladakh", tag: "High Altitude Passes" },
  { name: "Kodaikanal", state: "Tamil Nadu", tag: "Princess of Hill Stations" },
  { name: "Mysore Heritage", state: "Karnataka", tag: "Royal Palaces" },
  { name: "Varkala Cliffs", state: "Kerala", tag: "Arabian Sea Cliffs" },
];

export default function DestinationMarquee() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  // Triple destinations for seamless infinite scroll
  const displayItems = [...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS];

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

      if (!isHovered && !isDragging && el) {
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
  }, [isHovered, isDragging]);

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
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Manual arrow navigation
  const scrollByAmount = useCallback((amount: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  return (
    <section
      className="py-12 sm:py-16 relative overflow-hidden select-none"
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

      {/* Header bar */}
      <div className="container-site mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
            <Compass size={15} className="animate-spin-slow" />
            <span>Discover India With Us</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Iconic Destinations &amp; Scenic Circuits
          </h2>
        </div>

        {/* Manual navigation controls */}
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs hidden sm:inline mr-2">
            Auto-sliding • Drag or use arrows to explore
          </span>
          <button
            type="button"
            onClick={() => scrollByAmount(-320)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(320)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all"
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
        className={`flex items-center gap-4 overflow-x-auto no-scrollbar px-6 cursor-grab ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{
          scrollBehavior: isDragging ? "auto" : "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {displayItems.map((item, idx) => (
          <Link
            key={`${item.name}-${idx}`}
            href={`/packages?search=${encodeURIComponent(item.name)}`}
            className="flex-shrink-0 group relative rounded-2xl px-5 py-3.5 transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              minWidth: "220px",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FBBF24]">
                  {item.state}
                </span>
                <h3 className="text-white font-serif text-base font-bold group-hover:text-[#FBBF24] transition-colors whitespace-nowrap">
                  {item.name}
                </h3>
                <p className="text-white/60 text-xs mt-0.5 truncate max-w-[180px]">
                  {item.tag}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-[#D45C33] group-hover:text-white transition-all flex-shrink-0">
                <MapPin size={14} />
              </div>
            </div>

            {/* Glowing border highlight on hover */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#FBBF24]/50 pointer-events-none transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
