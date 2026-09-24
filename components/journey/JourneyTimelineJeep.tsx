"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import type { JourneyDay } from "./JourneyRoad";
import DayCard from "./DayCard";
import { Compass, Sparkles, Navigation } from "lucide-react";

interface JourneyTimelineJeepProps {
  days: JourneyDay[];
  vehicleType?: string;
}

export default function JourneyTimelineJeep({ days, vehicleType = "jeep" }: JourneyTimelineJeepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [expandedDayId, setExpandedDayId] = useState<string | null>(days[0]?.id || null);

  // Track scroll progress along the itinerary timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 30%"],
  });

  // Fast, responsive spring physics without sluggish delay
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 28,
    mass: 0.2,
    restDelta: 0.0005,
  });

  // Map progress to percentage along timeline
  const jeepTopPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  // Subtle vehicle vibration / sway
  const jeepSway = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, 2, -2, 1.5, 0]);
  const progressLineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Update active day stop as jeep moves
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!days || days.length === 0) return;
    const count = days.length;
    const index = Math.min(Math.floor(latest * count), count - 1);
    setActiveDayIndex(index);
  });

  const toggleDay = (id: string) => {
    setExpandedDayId((prev) => (prev === id ? null : id));
  };

  if (!days || days.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto px-2 sm:px-6 py-6">
      {/* Timeline Controls / Status banner */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E1D3]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B4F4A]">
          <Navigation size={15} className="text-[#D45C33]" />
          <span>Interactive Safari Itinerary</span>
        </div>
        <div className="text-xs font-semibold text-[#8C7A6B] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Currently: Day {activeDayIndex} of {days.length - 1}</span>
        </div>
      </div>

      {/* Main Timeline Grid */}
      <div className="relative">
        {/* Continuous Center-Left Vertical Dashed Road Spine */}
        <div
          className="absolute left-6 sm:left-8 top-5 bottom-8 w-1 pointer-events-none -translate-x-1/2"
          aria-hidden="true"
        >
          {/* Base vertical dashed line (Matches user screenshot: #0E625A dark teal dashes) */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, #0E625A 0px, #0E625A 8px, transparent 8px, transparent 18px)",
            }}
          />

          {/* Active road progress line */}
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#0E625A] via-[#D45C33] to-[#F59E0B] rounded-full shadow-sm"
            style={{
              height: progressLineHeight,
            }}
          />

          {/* The Traveling 4x4 Safari Jeep */}
          <motion.div
            className="absolute -left-[19px] z-30 pointer-events-none drop-shadow-xl"
            style={{
              top: jeepTopPercent,
              x: jeepSway,
            }}
          >
            <DetailedJeep />
          </motion.div>
        </div>

        {/* Days List */}
        <div className="space-y-8 sm:space-y-12 pl-16 sm:pl-20">
          {days.map((day, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === days.length - 1;
            const isActive = idx <= activeDayIndex;
            const isCurrent = idx === activeDayIndex;
            const isExpanded = expandedDayId === day.id;

            return (
              <div key={day.id} className="relative group">
                {/* Circular Day Marker (Over the dashed line) */}
                <button
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  aria-expanded={isExpanded}
                  className={`absolute -left-16 sm:-left-20 top-1 w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 z-20 focus:outline-none ${
                    isCurrent
                      ? "scale-110 shadow-lg ring-4 ring-[#D45C33]/25"
                      : "hover:scale-105"
                  }`}
                  style={{
                    background:
                      isFirst
                        ? "linear-gradient(135deg, #0E625A 0%, #164E48 100%)"
                        : isLast
                        ? "linear-gradient(135deg, #2B5C3B 0%, #8F7228 100%)"
                        : isActive
                        ? "linear-gradient(135deg, #265B4A 0%, #76642A 100%)"
                        : "linear-gradient(135deg, #E2DBD0 0%, #C4BBAE 100%)",
                    color: isActive ? "#FFFFFF" : "#57534E",
                    boxShadow: isActive
                      ? "0 4px 14px rgba(14, 98, 90, 0.35)"
                      : "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                  title={`Day ${idx}: ${day.title}`}
                >
                  {isFirst ? "0" : isLast ? "★" : idx}

                  {/* Pulsing ring on current stop */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#D45C33] animate-ping opacity-50" />
                  )}
                </button>

                {/* Day Card Header & Content */}
                <div
                  className={`rounded-2xl transition-all duration-300 border ${
                    isCurrent
                      ? "bg-white border-[#D45C33]/40 shadow-lg ring-1 ring-[#D45C33]/20"
                      : "bg-white/90 hover:bg-white border-[#E6E0D4] shadow-sm hover:shadow-md"
                  } p-5 sm:p-6`}
                >
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                    onClick={() => toggleDay(day.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isCurrent
                              ? "bg-[#D45C33]/15 text-[#D45C33]"
                              : "bg-[#0E625A]/10 text-[#0E625A]"
                          }`}
                        >
                          {isFirst ? "Day 0 · Departure / Arrival" : isLast ? "Day N · Return Journey" : `Day ${idx}`}
                        </span>
                        {day.subtitle && (
                          <span className="text-xs text-[#808E8B] hidden sm:inline">• {day.subtitle}</span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0B4F4A] group-hover:text-[#D45C33] transition-colors">
                        {day.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-bold text-[#0B4F4A] hover:text-[#D45C33] flex items-center gap-1 self-start sm:self-center transition-colors"
                      aria-label={isExpanded ? "Collapse day itinerary" : "Expand day itinerary"}
                    >
                      <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                      <span className="text-base leading-none transition-transform duration-200">
                        {isExpanded ? "▴" : "▾"}
                      </span>
                    </button>
                  </div>

                  {/* Expandable Activities / Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-[#F0EBE1]"
                    >
                      <DayCard day={day} />
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Detailed Safari Jeep SVG Component ──────────────────────────────────────────
function DetailedJeep() {
  return (
    <div className="relative w-10 h-16 flex items-center justify-center">
      {/* Headlights Forward Beam (casts light downwards along the dashed road) */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.45) 0%, rgba(251, 191, 36, 0.15) 50%, transparent 80%)",
          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
        }}
      />

      {/* 4x4 Jeep Vehicle Top-Down Body */}
      <svg
        viewBox="0 0 44 64"
        width="40"
        height="58"
        className="drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wheels (4 Offroad Tires) */}
        {/* Front Left */}
        <rect x="1" y="8" width="6" height="14" rx="2.5" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
        <line x1="2" y1="12" x2="6" y2="12" stroke="#78716C" strokeWidth="1" />
        <line x1="2" y1="16" x2="6" y2="16" stroke="#78716C" strokeWidth="1" />

        {/* Front Right */}
        <rect x="37" y="8" width="6" height="14" rx="2.5" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
        <line x1="38" y1="12" x2="42" y2="12" stroke="#78716C" strokeWidth="1" />
        <line x1="38" y1="16" x2="42" y2="16" stroke="#78716C" strokeWidth="1" />

        {/* Rear Left */}
        <rect x="1" y="42" width="6" height="14" rx="2.5" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
        <line x1="2" y1="46" x2="6" y2="46" stroke="#78716C" strokeWidth="1" />
        <line x1="2" y1="50" x2="6" y2="50" stroke="#78716C" strokeWidth="1" />

        {/* Rear Right */}
        <rect x="37" y="42" width="6" height="14" rx="2.5" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
        <line x1="38" y1="46" x2="42" y2="46" stroke="#78716C" strokeWidth="1" />
        <line x1="38" y1="50" x2="42" y2="50" stroke="#78716C" strokeWidth="1" />

        {/* Main Jeep Cabin & Chassis */}
        <rect x="6" y="4" width="32" height="54" rx="5" fill="#0E625A" stroke="#093E3A" strokeWidth="1.5" />

        {/* Front Bull Bar / Bumper */}
        <rect x="8" y="2" width="28" height="3" rx="1.5" fill="#292524" />
        {/* Front Headlights */}
        <circle cx="11" cy="4" r="2.2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
        <circle cx="33" cy="4" r="2.2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />

        {/* Hood / Engine Bonnet */}
        <rect x="10" y="6" width="24" height="12" rx="2" fill="#147B72" />
        <line x1="14" y1="9" x2="14" y2="14" stroke="#0E625A" strokeWidth="1" />
        <line x1="22" y1="8" x2="22" y2="15" stroke="#0E625A" strokeWidth="1" />
        <line x1="30" y1="9" x2="30" y2="14" stroke="#0E625A" strokeWidth="1" />

        {/* Front Windshield */}
        <path d="M9 19 L11 25 L33 25 L35 19 Z" fill="#67E8F9" opacity="0.85" stroke="#0E625A" strokeWidth="1" />
        {/* Windshield glare line */}
        <line x1="14" y1="20" x2="26" y2="24" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />

        {/* Safari Roof Rack */}
        <rect x="9" y="26" width="26" height="26" rx="3" fill="#D45C33" stroke="#B84922" strokeWidth="1.2" />
        {/* Roof Rack Crossbars */}
        <line x1="9" y1="33" x2="35" y2="33" stroke="#8C2F12" strokeWidth="1" />
        <line x1="9" y1="41" x2="35" y2="41" stroke="#8C2F12" strokeWidth="1" />
        <line x1="9" y1="48" x2="35" y2="48" stroke="#8C2F12" strokeWidth="1" />

        {/* Safari Luggage Bags on Roof Rack */}
        {/* Bag 1 (Canvas Brown) */}
        <rect x="12" y="28" width="10" height="9" rx="1.5" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
        <line x1="17" y1="28" x2="17" y2="37" stroke="#78350F" strokeWidth="0.8" />

        {/* Bag 2 (Duffel Green) */}
        <rect x="23" y="29" width="9" height="7" rx="2" fill="#15803D" stroke="#166534" strokeWidth="0.8" />

        {/* Spare Tire on Rear Rack */}
        <circle cx="22" cy="45" r="5.5" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
        <circle cx="22" cy="45" r="2.2" fill="#78716C" />

        {/* Rear Tail Lights */}
        <rect x="8" y="56" width="4" height="2" rx="0.5" fill="#EF4444" />
        <rect x="32" y="56" width="4" height="2" rx="0.5" fill="#EF4444" />
      </svg>
    </div>
  );
}
