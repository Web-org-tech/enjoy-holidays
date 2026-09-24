import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  scrolled?: boolean;
  variant?: "light" | "dark" | "white";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({
  scrolled = false,
  variant = "light",
  className = "",
  size = "md",
}: BrandLogoProps) {
  // Determine text color based on scrolled or variant
  const isWhite = variant === "white" || (!scrolled && variant === "light");

  const emblemSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Official Rounded Brand Emblem using public/logo.png */}
      <div
        className={`${emblemSizes[size]} rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300 relative overflow-hidden flex-shrink-0 p-0.5`}
        style={{
          background: isWhite ? "rgba(255,255,255,0.2)" : "#FFFFFF",
          border: isWhite ? "2px solid rgba(255,255,255,0.4)" : "2px solid #0B4F4A",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <Image
          src="/logo.png"
          alt="PADMA TOURS & TRAVELS Logo"
          width={48}
          height={48}
          className="w-full h-full object-cover rounded-full group-hover:rotate-6 transition-transform"
          priority
        />
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col">
        <span
          className={`font-serif tracking-wide font-bold leading-none transition-colors duration-300 ${
            size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl"
          } ${isWhite ? "text-white" : "text-[var(--color-text-primary)]"}`}
        >
          PADMA
        </span>
        <span
          className={`font-sans text-[10px] tracking-[0.2em] font-extrabold uppercase mt-0.5 leading-none transition-colors duration-300 ${
            isWhite ? "text-[var(--color-secondary-light)]" : "text-[var(--color-primary)]"
          }`}
        >
          TOURS &amp; TRAVELS
        </span>
        <span
          className={`text-[8px] font-semibold tracking-wider transition-colors duration-300 ${
            isWhite ? "text-white/60" : "text-[var(--color-text-muted)]"
          }`}
        >
          SINCE 2004 • MADURAI
        </span>
      </div>
    </div>
  );
}
