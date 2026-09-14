import type { JourneyDay } from "./JourneyRoad";
import Image from "next/image";
import { X } from "lucide-react";
import ActivityIcon from "./ActivityIcon";

interface DayCardProps {
  day: JourneyDay;
  onClose?: () => void;
}

export default function DayCard({ day, onClose }: DayCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{
        background: "white",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Optional day photo */}
      {day.photo_url && (
        <div className="relative h-36 overflow-hidden">
          <Image
            src={day.photo_url}
            alt={day.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <h3 className="font-serif text-lg text-white leading-tight">{day.title}</h3>
            {day.subtitle && (
              <p className="text-white/80 text-xs mt-0.5">{day.subtitle}</p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
              aria-label="Close day details"
            >
              <X size={14} className="text-white" />
            </button>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Header (if no photo) */}
        {!day.photo_url && (
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-serif text-base text-[var(--color-text-primary)] leading-tight">
                {day.title}
              </h3>
              {day.subtitle && (
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{day.subtitle}</p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 ml-2"
                aria-label="Close day details"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Activities list */}
        {day.day_activities && day.day_activities.length > 0 && (
          <ul className="flex flex-col gap-2.5" role="list">
            {day.day_activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "var(--color-surface-alt)" }}>
                  <ActivityIcon icon={activity.icon} size={14} />
                </span>
                <span className="text-sm text-[var(--color-text-secondary)] leading-snug pt-0.5">
                  {activity.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Transition text to next stop */}
        {day.transition_text && (
          <div
            className="mt-4 pt-3 border-t border-dashed border-[var(--color-border)] flex items-start gap-2"
          >
            <span className="text-[var(--color-primary)] text-sm flex-shrink-0">→</span>
            <p className="text-xs text-[var(--color-text-muted)] italic leading-relaxed">
              {day.transition_text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
