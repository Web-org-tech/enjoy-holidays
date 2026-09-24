"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, MessageCircle, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PADMA TOURS Error Boundary]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{ background: "#FAF7F2" }}
    >
      <div className="text-center max-w-lg bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#E8E1D3]">
        {/* Broken jeep illustration */}
        <div className="w-36 h-36 mx-auto mb-6">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="80" cy="80" r="70" fill="rgba(11,79,74,0.06)" />
            {/* Jeep body */}
            <rect x="35" y="80" width="90" height="35" rx="6" fill="#0B4F4A" opacity="0.85" />
            <rect x="45" y="60" width="60" height="25" rx="5" fill="#073834" opacity="0.85" />
            {/* Windows */}
            <rect x="50" y="64" width="22" height="16" rx="3" fill="rgba(255,255,255,0.4)" />
            <rect x="76" y="64" width="22" height="16" rx="3" fill="rgba(255,255,255,0.4)" />
            {/* Flat tire front */}
            <ellipse cx="57" cy="115" rx="14" ry="7" fill="#1C1917" />
            <ellipse cx="57" cy="115" rx="8" ry="4" fill="#44403C" />
            {/* Normal tire back */}
            <circle cx="103" cy="115" r="13" fill="#1C1917" />
            <circle cx="103" cy="115" r="7" fill="#44403C" />
            {/* Steam/smoke from hood */}
            <path d="M70 60 Q75 45 68 35" stroke="rgba(212,92,51,0.5)" strokeWidth="3" strokeLinecap="round" />
            <path d="M80 58 Q85 40 82 30" stroke="rgba(212,92,51,0.4)" strokeWidth="2" strokeLinecap="round" />
            {/* Road */}
            <rect x="20" y="122" width="120" height="4" rx="2" fill="#E8E1D3" />
            {/* Alert badge */}
            <circle cx="125" cy="50" r="16" fill="#FEF3C7" />
            <text x="125" y="56" textAnchor="middle" fill="#D97706" fontSize="18" fontWeight="700">!</text>
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
          <AlertTriangle size={13} />
          <span>Temporary Roadblock</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B4F4A] mb-2">
          Our Safari Jeep Hit a Bump
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6D69] mb-8 leading-relaxed">
          We encountered an unexpected roadblock loading this page. Our team is available 24/7 if you need immediate tour assistance.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-left">
            <p className="text-xs font-mono text-red-700 truncate">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B4F4A] hover:bg-[#073834] text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#0B4F4A]/30 text-[#0B4F4A] hover:bg-[#0B4F4A]/5 font-bold text-xs transition-all"
          >
            <Home size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#F0EBE1] text-xs text-[#71827E]">
          Need urgent booking help?{" "}
          <a
            href="https://wa.me/917010111256?text=Hi%20Padma%20Tours!%20I%20need%20assistance"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#25D366] hover:underline inline-flex items-center gap-1 ml-1"
          >
            <MessageCircle size={13} /> Chat on WhatsApp (24/7)
          </a>
        </div>
      </div>
    </div>
  );
}
