"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { JourneyDay } from "./JourneyRoad";
import DayCard from "./DayCard";
import ActivityIcon from "./ActivityIcon";

interface JourneyRoadAnimatedProps {
  days: JourneyDay[];
  vehicleType?: string;
}

// Generate a smooth winding road path through N stops
function generateRoadPath(stops: number, width: number, height: number): string {
  const segH = height / (stops - 1);
  const amplitude = width * 0.28;
  const cx = width / 2;
  const points: [number, number][] = [];

  for (let i = 0; i < stops; i++) {
    const y = i * segH;
    const side = i % 2 === 0 ? -1 : 1;
    const x = cx + side * amplitude * (i === 0 || i === stops - 1 ? 0 : 1);
    points.push([x, y]);
  }

  // Build smooth bezier path
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx2, cy2] = points[i];
    const mx = (px + cx2) / 2;
    d += ` C ${mx} ${py}, ${mx} ${cy2}, ${cx2} ${cy2}`;
  }
  return d;
}

// Get stop positions along the path
function getStopPositions(stops: number, width: number, height: number): Array<{ x: number; y: number }> {
  const segH = height / (stops - 1);
  const amplitude = width * 0.28;
  const cx = width / 2;
  return Array.from({ length: stops }, (_, i) => {
    const y = i * segH;
    const side = i % 2 === 0 ? -1 : 1;
    const x = cx + side * amplitude * (i === 0 || i === stops - 1 ? 0 : 1);
    return { x, y };
  });
}

export default function JourneyRoadAnimated({ days, vehicleType = "jeep" }: JourneyRoadAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const jeepRef = useRef<SVGGElement>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [visibleStops, setVisibleStops] = useState<number[]>([]);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  const SVG_W = 340;
  const SVG_H = days.length > 4 ? days.length * 200 : days.length * 240;
  const stops = getStopPositions(days.length, SVG_W, SVG_H);
  const roadPath = generateRoadPath(days.length, SVG_W, SVG_H);

  // GSAP scroll animation
  useEffect(() => {
    let ctx: { revert?: () => void } = {};

    async function initGSAP() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");

      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      setGsapLoaded(true);

      ctx = gsap.context(() => {
        if (!progressPathRef.current || !jeepRef.current || !svgRef.current || !containerRef.current) return;

        const pathEl = progressPathRef.current;
        const totalLength = pathEl.getTotalLength();

        // Set initial dash state
        gsap.set(pathEl, { strokeDasharray: totalLength, strokeDashoffset: totalLength });

        // Road draw animation
        gsap.to(pathEl, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.5,
          },
        });

        // Jeep follows path
        gsap.to(jeepRef.current, {
          motionPath: {
            path: pathEl,
            align: pathEl,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.5,
          },
        });

        // Animate stops in as jeep reaches them
        days.forEach((_, i) => {
          const progress = i / (days.length - 1);
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: `${progress * 80}% 60%`,
            onEnter: () => setVisibleStops((prev) => Array.from(new Set([...prev, i]))),
          });
        });
      });
    }

    initGSAP();

    return () => {
      if (ctx.revert) ctx.revert();
    };
  }, [days]);

  const toggleDay = useCallback((id: string) => {
    setActiveDay((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full overflow-x-hidden"
      style={{ maxWidth: 700 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-0 md:gap-8 w-full">
        {/* SVG Road column */}
        <div
          className="flex-shrink-0 relative max-w-full flex justify-center"
          style={{ width: "min(100%, 340px)", height: SVG_H }}
          aria-hidden="true"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width={SVG_W}
            height={SVG_H}
            className="road-svg max-w-full"
          >
            {/* Base road (grey) */}
            <path d={roadPath} className="road-path" strokeWidth={8} />

            {/* Road center dashes */}
            <path d={roadPath} className="road-center-line" />

            {/* Progress road (terracotta, draws on scroll) */}
            <path
              ref={progressPathRef}
              d={roadPath}
              className="road-path-progress"
              strokeWidth={8}
            />

            {/* Stop markers */}
            {stops.map((pos, i) => (
              <g
                key={i}
                className="day-stop-marker"
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => toggleDay(days[i].id)}
                tabIndex={0}
                role="button"
                aria-label={`${days[i].title} — click to expand`}
                aria-expanded={activeDay === days[i].id}
                onKeyDown={(e) => e.key === "Enter" && toggleDay(days[i].id)}
                style={{
                  opacity: visibleStops.includes(i) ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                {/* Pulse ring */}
                {activeDay === days[i].id && (
                  <circle r={22} fill="rgba(212,92,51,0.15)" className="animate-pulse-soft" />
                )}

                {/* Outer circle */}
                <circle
                  r={16}
                  fill={activeDay === days[i].id ? "var(--color-primary)" : "white"}
                  stroke={activeDay === days[i].id ? "var(--color-primary)" : "var(--color-border)"}
                  strokeWidth={2}
                  style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }}
                />

                {/* Day number */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={i === 0 || i === days.length - 1 ? 8 : 11}
                  fontWeight="700"
                  fill={activeDay === days[i].id ? "white" : "var(--color-primary)"}
                  fontFamily="var(--font-sans)"
                >
                  {i === 0 ? "GO" : i === days.length - 1 ? "★" : `D${i}`}
                </text>

                {/* Label beside marker */}
                <text
                  x={i % 2 === 0 ? -26 : 26}
                  textAnchor={i % 2 === 0 ? "end" : "start"}
                  dominantBaseline="central"
                  fontSize={10}
                  fontWeight="600"
                  fill="var(--color-text-secondary)"
                  fontFamily="var(--font-sans)"
                  className="select-none"
                >
                  {days[i].title.length > 16
                    ? days[i].title.substring(0, 16) + "…"
                    : days[i].title}
                </text>
              </g>
            ))}

            {/* Jeep/vehicle SVG icon */}
            <g ref={jeepRef} style={{ opacity: gsapLoaded ? 1 : 0 }}>
              {vehicleType === "boat" ? (
                <BoatIcon />
              ) : vehicleType === "bike" ? (
                <BikeIcon />
              ) : (
                <JeepIcon />
              )}
            </g>
          </svg>
        </div>

        {/* Day cards column — shown on desktop beside road, below on mobile */}
        <div className="hidden md:flex flex-col justify-between flex-1" style={{ height: SVG_H }}>
          {days.map((day, i) => (
            <div
              key={day.id}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                opacity: visibleStops.includes(i) ? 1 : 0,
                transform: visibleStops.includes(i) ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.5s ease",
              }}
            >
              {activeDay === day.id ? (
                <DayCard day={day} onClose={() => setActiveDay(null)} />
              ) : (
                <button
                  className="text-left px-4 py-2 rounded-xl hover:bg-[var(--color-surface-alt)] transition-colors duration-150 w-full"
                  onClick={() => toggleDay(day.id)}
                  id={`journey-day-${i}`}
                >
                  <div className="text-xs text-[var(--color-primary)] font-semibold mb-0.5">
                    {i === 0 ? "Day 0 · Departure" : i === days.length - 1 ? "Return" : `Day ${i}`}
                  </div>
                  <div className="font-serif text-sm font-medium text-[var(--color-text-primary)]">
                    {day.title}
                  </div>
                  {day.subtitle && (
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{day.subtitle}</div>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: expanded day cards appear below SVG */}
      <div className="md:hidden mt-6">
        {days.map((day, i) => (
          <div key={day.id} className="mb-3">
            <button
              className="w-full text-left px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white flex items-center gap-3"
              onClick={() => toggleDay(day.id)}
              aria-expanded={activeDay === day.id}
              id={`journey-day-mobile-${i}`}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: activeDay === day.id ? "var(--color-primary)" : "var(--color-surface-alt)",
                  color: activeDay === day.id ? "white" : "var(--color-primary)",
                }}
              >
                {i === 0 ? "GO" : i === days.length - 1 ? "★" : i}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--color-primary)] font-semibold">
                  {i === 0 ? "Departure" : i === days.length - 1 ? "Return" : `Day ${i}`}
                </div>
                <div className="font-serif text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {day.title}
                </div>
              </div>
              <span
                className="text-[var(--color-text-muted)] transition-transform duration-200"
                style={{ transform: activeDay === day.id ? "rotate(180deg)" : "none" }}
              >
                ▾
              </span>
            </button>
            {activeDay === day.id && (
              <div className="mt-1">
                <DayCard day={day} onClose={() => setActiveDay(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Vehicle SVG icons
function JeepIcon() {
  return (
    <g transform="translate(-16,-10)">
      <rect x="2" y="10" width="28" height="12" rx="3" fill="var(--color-primary)" />
      <rect x="5" y="5" width="18" height="8" rx="2" fill="var(--color-primary-dark)" />
      <rect x="6" y="6" width="7" height="5" rx="1" fill="rgba(255,255,255,0.5)" />
      <rect x="14" y="6" width="7" height="5" rx="1" fill="rgba(255,255,255,0.5)" />
      <circle cx="8" cy="22" r="4" fill="#333" />
      <circle cx="8" cy="22" r="2" fill="#666" />
      <circle cx="22" cy="22" r="4" fill="#333" />
      <circle cx="22" cy="22" r="2" fill="#666" />
      <rect x="28" y="13" width="4" height="3" rx="1" fill="var(--color-secondary)" />
    </g>
  );
}

function BoatIcon() {
  return (
    <g transform="translate(-18,-12)">
      <path d="M2 20 Q18 14 34 20 L30 26 L6 26 Z" fill="var(--color-accent)" />
      <rect x="14" y="6" width="3" height="16" fill="var(--color-accent-light)" />
      <path d="M14 6 L26 14 L14 14 Z" fill="white" opacity="0.8" />
    </g>
  );
}

function BikeIcon() {
  return (
    <g transform="translate(-14,-10)">
      <circle cx="5" cy="15" r="5" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
      <circle cx="23" cy="15" r="5" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
      <path d="M5 15 L14 8 L23 15" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
      <path d="M14 8 L14 4 L18 2" stroke="var(--color-primary-dark)" strokeWidth="1.5" fill="none" />
    </g>
  );
}
