"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PackageDay, DayActivity } from "@/lib/supabase/types";
import JourneyReducedMotion from "./JourneyReducedMotion";

const JourneyRoadAnimated = dynamic(() => import("./JourneyRoadAnimated"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
    </div>
  ),
});

export interface JourneyDay extends PackageDay {
  day_activities: DayActivity[];
}

interface JourneyRoadProps {
  days: JourneyDay[];
  vehicleType?: string;
}

export default function JourneyRoad({ days, vehicleType = "jeep" }: JourneyRoadProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (prefersReducedMotion) {
    return <JourneyReducedMotion days={days} />;
  }

  return <JourneyRoadAnimated days={days} vehicleType={vehicleType} />;
}
