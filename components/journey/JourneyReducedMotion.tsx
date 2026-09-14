import type { JourneyDay } from "./JourneyRoad";
import DayCard from "./DayCard";

interface JourneyReducedMotionProps {
  days: JourneyDay[];
}

export default function JourneyReducedMotion({ days }: JourneyReducedMotionProps) {
  return (
    <div
      className="relative max-w-2xl mx-auto"
      role="list"
      aria-label="Journey itinerary"
    >
      {days.map((day, i) => {
        const isLast = i === days.length - 1;
        const isFirst = i === 0;
        return (
          <div key={day.id} className="flex gap-4" role="listitem">
            {/* Timeline spine */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Day marker dot */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0 z-10"
                style={{
                  background: isFirst || isLast
                    ? "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)"
                    : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                }}
              >
                {isFirst ? "0" : isLast ? "★" : i}
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className="w-0.5 flex-1 my-2"
                  style={{
                    background: "repeating-linear-gradient(to bottom, var(--color-primary) 0px, var(--color-primary) 6px, transparent 6px, transparent 12px)",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
              <div className="mb-2">
                <span className="label text-[var(--color-primary)] text-[10px]">
                  {isFirst ? "Day 0 · Departure" : isLast ? "Return" : `Day ${i}`}
                </span>
              </div>
              <DayCard day={day} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
