"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  subtext?: string;
  backgroundMediaUrl?: string;
  backgroundMediaType?: "image" | "video";
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  whatsappNumber?: string;
}

const DEFAULTS = {
  headline: "Where Will You\nWander Next?",
  subtext:
    "Handcrafted holiday packages across India — we craft journeys, not just trips.",
  backgroundMediaUrl:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80",
  backgroundMediaType: "image" as const,
  ctaPrimaryLabel: "Explore Packages",
  ctaSecondaryLabel: "WhatsApp Us",
  whatsappNumber: "919999999999",
};

export default function HeroSection(props: HeroSectionProps) {
  const config = { ...DEFAULTS, ...props };
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    "Hi! I'd like to enquire about your holiday packages 🌍"
  )}`;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay"
      aria-label="Hero section"
    >
      {/* Background media */}
      <div className="absolute inset-0 z-0">
        {config.backgroundMediaType === "video" && config.backgroundMediaUrl ? (
          <video
            ref={videoRef}
            src={config.backgroundMediaUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${config.backgroundMediaUrl ?? DEFAULTS.backgroundMediaUrl})`,
            }}
            role="img"
            aria-label="Beautiful travel destination"
          />
        )}

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F4A]/70 via-[#0B4F4A]/30 to-[#d45c33]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
      </div>

      {/* Floating decorative dots (flight path) */}
      <div className="absolute inset-0 z-1 pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
            style={{
              left: `${15 + i * 14}%`,
              top: `${30 + Math.sin(i) * 20}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], y: [-4, 4, -4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container-site text-center py-20 pt-28 sm:py-28 sm:pt-36 md:py-32 md:pt-40">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8 text-white/90 text-[11px] sm:text-xs font-semibold tracking-widest uppercase max-w-[90vw] truncate"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse-soft shrink-0" />
          <span className="truncate">Premium Handcrafted Experiences · Est. 2018</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="display-hero text-white mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textShadow: "0 4px 32px rgba(0,0,0,0.3)" }}
        >
          {config.headline.split("\n").map((line, i) => (
            <span key={i} className="block">
              {i === 1 ? (
                <span className="italic" style={{ color: "var(--color-secondary-light)" }}>
                  {line}
                </span>
              ) : (
                line
              )}
            </span>
          ))}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="body-lg text-white/85 max-w-xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
        >
          {config.subtext}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <Link
            href="/packages"
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,92,51,0.5)] active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            }}
            id="hero-explore-cta"
          >
            {config.ctaPrimaryLabel}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.4)",
              backdropFilter: "blur(8px)",
            }}
            id="hero-whatsapp-cta"
          >
            <MessageCircle size={18} />
            {config.ctaSecondaryLabel}
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex items-center justify-center gap-6 sm:gap-8 mt-12 sm:mt-16 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: "500+", label: "Trips Completed" },
            { value: "98%", label: "Happy Travellers" },
            { value: "25+", label: "Destinations" },
            { value: "6+", label: "Years Experience" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-serif text-2xl font-bold text-white"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
              >
                {value}
              </div>
              <div className="label text-white/60 text-[10px] mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-hidden="true"
      >
        <span className="label text-white/50 text-[10px]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
