import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Trail Not Found",
  description: "This trail doesn't exist on our map. Let's get you back on track.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20 grain-overlay"
      style={{ background: "var(--color-background)" }}
    >
      <div className="text-center max-w-lg">
        {/* Illustrated compass/signpost */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Background circle */}
            <circle cx="80" cy="80" r="70" fill="rgba(212,92,51,0.06)" />
            <circle cx="80" cy="80" r="55" fill="rgba(212,92,51,0.04)" stroke="rgba(212,92,51,0.15)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Post */}
            <rect x="77" y="60" width="6" height="80" rx="3" fill="var(--color-accent)" />

            {/* Signs */}
            <rect x="40" y="65" width="55" height="20" rx="4" fill="var(--color-primary)" />
            <text x="68" y="79" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="sans-serif">Kochi →</text>

            <rect x="55" y="88" width="50" height="18" rx="4" fill="var(--color-secondary)" />
            <text x="80" y="100" textAnchor="middle" fill="white" fontSize="8" fontWeight="600" fontFamily="sans-serif">← Varkala</text>

            <rect x="45" y="108" width="52" height="18" rx="4" fill="var(--color-accent)" />
            <text x="71" y="120" textAnchor="middle" fill="white" fontSize="8" fontWeight="600" fontFamily="sans-serif">Coorg →</text>

            {/* Question mark floating */}
            <circle cx="115" cy="50" r="18" fill="rgba(212,92,51,0.1)" />
            <text x="115" y="56" textAnchor="middle" fill="var(--color-primary)" fontSize="20" fontWeight="700" fontFamily="serif">?</text>
          </svg>
        </div>

        {/* 404 number */}
        <div
          className="font-serif text-8xl font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>

        <h1 className="display-md text-[var(--color-text-primary)] mb-3">
          This Trail Doesn&apos;t Exist
        </h1>
        <p className="body-md text-[var(--color-text-muted)] mb-8">
          Looks like this path isn&apos;t on our map. The page you&apos;re looking for may have moved or been removed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all hover:scale-105 shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all"
          >
            <MapPin size={14} />
            Explore Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
