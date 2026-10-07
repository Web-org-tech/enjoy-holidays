import TourLoader from "@/components/ui/TourLoader";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Top banner matching all inner pages so navbar text & logo remain 100% legible during page load */}
      <section
        className="w-full pt-36 sm:pt-44 pb-16 sm:pb-20 grain-overlay relative overflow-hidden"
        style={{ background: "var(--color-deep-teal)" }}
      >
        <div className="container-site max-w-4xl text-center relative z-10 px-4">
          <div className="h-4 w-32 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 sm:h-12 w-64 sm:w-96 bg-white/15 rounded-2xl mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-48 sm:w-80 bg-white/10 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Decorative subtle bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden pointer-events-none opacity-40">
          <svg viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,24 C360,8 1080,8 1440,24 L1440,24 L0,24 Z" fill="#FAF7F2" />
          </svg>
        </div>
      </section>

      {/* Main loading spinner area */}
      <div className="flex-1 flex items-center justify-center py-20">
        <TourLoader />
      </div>
    </div>
  );
}
