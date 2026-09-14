const DESTINATIONS = [
  "Kerala Backwaters",
  "Coorg Highlands",
  "Rajasthan Desert",
  "Goa Beaches",
  "Himachal Peaks",
  "Ooty Hills",
  "Andaman Islands",
  "Pondicherry",
  "Munnar Tea Gardens",
  "Varanasi Ghats",
  "Jaipur Palaces",
  "Ladakh Mountains",
  "Kodaikanal",
  "Mysore Heritage",
  "Varkala Cliffs",
];

export default function DestinationMarquee() {
  const doubled = [...DESTINATIONS, ...DESTINATIONS];

  return (
    <section
      className="py-12 overflow-hidden"
      style={{ background: "var(--color-primary)", position: "relative" }}
      aria-label="Destinations we cover"
    >
      {/* Slight grain texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none grain-overlay" />

      {/* Row 1 */}
      <div className="marquee-track items-center gap-0 mb-3">
        {doubled.map((dest, i) => (
          <span key={`r1-${i}`} className="flex items-center flex-shrink-0">
            <span className="text-white font-serif text-base italic px-5 whitespace-nowrap">
              {dest}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
          </span>
        ))}
      </div>

      {/* Row 2 (reversed) */}
      <div className="marquee-track marquee-track-reverse items-center gap-0">
        {[...doubled].reverse().map((dest, i) => (
          <span key={`r2-${i}`} className="flex items-center flex-shrink-0">
            <span className="text-white/70 font-sans text-xs font-semibold tracking-widest uppercase px-5 whitespace-nowrap">
              {dest}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
          </span>
        ))}
      </div>
    </section>
  );
}
