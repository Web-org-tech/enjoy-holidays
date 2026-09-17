"use client";

import React, { useEffect, useState } from "react";
import { Compass, Plane, MapPin } from "lucide-react";

const TRAVEL_QUOTES = [
  "Plotting scenic routes...",
  "Curating handpicked stays...",
  "Mapping hidden backwater trails...",
  "Gathering authentic local flavors...",
  "Preparing your handcrafted journey...",
];

interface TourLoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export default function TourLoader({ label, fullscreen = false }: TourLoaderProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % TRAVEL_QUOTES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8">
      {/* Animated Compass & Flight Orbit */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        {/* Pulsing halo rings */}
        <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/10 animate-ping opacity-40" />
        <div className="absolute -inset-2 rounded-full border border-[var(--color-secondary)]/30 animate-pulse" />

        {/* Orbiting Plane */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s", animationTimingFunction: "linear" }}>
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[var(--color-secondary)] drop-shadow-sm rotate-90">
            <Plane size={18} fill="currentColor" />
          </div>
        </div>

        {/* Center Compass Emblem */}
        <div className="w-16 h-16 rounded-full bg-[#004741] text-[#D49B35] flex items-center justify-center shadow-lg border-2 border-[#D49B35]/40 relative z-10">
          <Compass size={32} className="animate-spin" style={{ animationDuration: "10s", animationTimingFunction: "linear" }} />
          <div className="absolute w-2 h-2 rounded-full bg-white shadow-sm" />
        </div>
      </div>

      {/* Brand Title */}
      <div className="font-serif font-bold text-lg text-[var(--color-primary)] tracking-wide mb-1">
        ENJOY Holidays
      </div>

      {/* Dynamic Travel Microcopy */}
      <div className="text-xs text-[var(--color-text-muted)] font-medium h-5 transition-opacity duration-300 flex items-center gap-1.5">
        <MapPin size={12} className="text-[var(--color-secondary)] shrink-0" />
        <span>{label || TRAVEL_QUOTES[quoteIndex]}</span>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F0EDE4] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
