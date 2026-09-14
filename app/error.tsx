"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Error boundary]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ background: "var(--color-background)" }}
    >
      <div className="text-center max-w-lg">
        {/* Broken jeep illustration */}
        <div className="w-40 h-40 mx-auto mb-8">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="80" cy="80" r="70" fill="rgba(212,92,51,0.06)" />
            {/* Jeep body */}
            <rect x="35" y="80" width="90" height="35" rx="6" fill="var(--color-primary)" opacity="0.8" />
            <rect x="45" y="60" width="60" height="25" rx="5" fill="var(--color-primary-dark)" opacity="0.8" />
            {/* Windows */}
            <rect x="50" y="64" width="22" height="16" rx="3" fill="rgba(255,255,255,0.4)" />
            <rect x="76" y="64" width="22" height="16" rx="3" fill="rgba(255,255,255,0.4)" />
            {/* Flat tire front */}
            <ellipse cx="57" cy="115" rx="14" ry="7" fill="#333" />
            <ellipse cx="57" cy="115" rx="8" ry="4" fill="#555" />
            {/* Normal tire back */}
            <circle cx="103" cy="115" r="13" fill="#333" />
            <circle cx="103" cy="115" r="7" fill="#555" />
            {/* Steam/smoke from hood */}
            <path d="M70 60 Q75 45 68 35" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
            <path d="M80 58 Q85 40 82 30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
            {/* Road */}
            <rect x="20" y="122" width="120" height="4" rx="2" fill="var(--color-border)" />
            {/* ! sign */}
            <circle cx="125" cy="50" r="16" fill="rgba(245,158,11,0.15)" />
            <text x="125" y="56" textAnchor="middle" fill="var(--color-secondary)" fontSize="20" fontWeight="700">!</text>
          </svg>
        </div>

        <div
          className="font-serif text-7xl font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Oops
        </div>

        <h1 className="display-md text-[var(--color-text-primary)] mb-3">
          Our Jeep Broke Down
        </h1>
        <p className="body-md text-[var(--color-text-muted)] mb-8">
          Something went wrong on our end. Our team has been notified and is working to fix it. Please try again or head back to safety.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-left">
            <p className="text-xs font-mono text-red-700">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all hover:scale-105 shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
