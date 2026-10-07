"use client";

import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

export default function FeedbackShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window === "undefined") return;
    const text = encodeURIComponent(
      `Hello! Please share your travel experience and review with PADMA TOURS & TRAVELS here: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0B4F4A]/20 bg-white hover:bg-[#0B4F4A]/5 text-[#0B4F4A] text-xs font-semibold shadow-xs transition-all active:scale-95"
        title="Copy URL to share with travelers"
      >
        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
        <span>{copied ? "Link Copied!" : "Copy Review Link"}</span>
      </button>

      <button
        type="button"
        onClick={handleShareWhatsApp}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20BE5A] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
      >
        <Share2 size={14} />
        <span>Share via WhatsApp</span>
      </button>
    </div>
  );
}
